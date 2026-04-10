---
title: குப்பை சேகரிப்பு
content_type: concept
weight: 70
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}} இது
பின்வரும் வளங்களை சுத்தம் செய்ய அனுமதிக்கிறது:

* [முடிவடைந்த Pod கள்](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [முடிந்த Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/)
* [உரிமையாளர் குறிப்புகள் இல்லாத பொருட்கள்](#owners-dependents)
* [பயன்படுத்தப்படாத கொள்கலன்கள் மற்றும் கொள்கலன் படங்கள்](#containers-images)
* [Delete கொள்கையுடன் StorageClass மூலம் உருவாக்கப்பட்ட PersistentVolumes](/docs/concepts/storage/persistent-volumes/#delete)
* [காலாவதியான CertificateSigningRequests (CSRs)](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* {{<glossary_tooltip text="Nodes" term_id="node">}} பின்வரும் சூழல்களில் நீக்கப்படும்:
  * கொத்தில் [cloud controller manager](/docs/concepts/architecture/cloud-controller/) பயன்படுத்தும்போது
  * cloud controller manager போன்ற addon பயன்படுத்தும் on-premises சூழலில்
* [Node Lease பொருட்கள்](/docs/concepts/architecture/nodes/#heartbeats)

## உரிமையாளர்கள் மற்றும் சார்புடையவர்கள் {#owners-dependents}

Kubernetes இல் பல பொருட்கள் [*உரிமையாளர் குறிப்புகள்*](/docs/concepts/overview/working-with-objects/owners-dependents/) மூலம் ஒன்றோடொன்று இணைக்கப்படுகின்றன.
உரிமையாளர் குறிப்புகள், கட்டுப்பாட்டு தளத்திற்கு (Control Plane) எந்த பொருட்கள் மற்றவற்றைச் சார்ந்துள்ளன என்பதை தெரிவிக்கின்றன.
Kubernetes, ஒரு பொருளை நீக்குவதற்கு முன்பு தொடர்புடைய வளங்களை சுத்தம் செய்வதற்கு கட்டுப்பாட்டு தளத்திற்கும் மற்ற API கிளையன்ட்களுக்கும் வாய்ப்பளிக்க உரிமையாளர் குறிப்புகளைப் பயன்படுத்துகிறது.
பெரும்பாலான சந்தர்ப்பங்களில், Kubernetes தானாகவே உரிமையாளர் குறிப்புகளை நிர்வகிக்கிறது.

உரிமையுரிமை என்பது சில வளங்கள் பயன்படுத்தும் [labels மற்றும் selectors](/docs/concepts/overview/working-with-objects/labels/) வழிமுறையிலிருந்து வேறுபட்டது.
உதாரணமாக, `EndpointSlice` பொருட்களை உருவாக்கும் ஒரு {{<glossary_tooltip text="Service" term_id="service">}} ஐ எடுத்துக்கொள்வோம்.
Service, கட்டுப்பாட்டு தளம் எந்த `EndpointSlice` பொருட்கள் பயன்படுத்தப்படுகின்றன என்பதை தீர்மானிக்க *labels* பயன்படுத்துகிறது.
Labels க்கு கூடுதலாக, ஒரு Service சார்பாக நிர்வகிக்கப்படும் ஒவ்வொரு `EndpointSlice` க்கும் உரிமையாளர் குறிப்பு உள்ளது.
உரிமையாளர் குறிப்புகள் Kubernetes இன் வெவ்வேறு பகுதிகள் தாங்கள் கட்டுப்படுத்தாத பொருட்களில் தலையிடாமல் இருக்க உதவுகின்றன.

{{< note >}}
Cross-namespace உரிமையாளர் குறிப்புகள் வடிவமைப்பால் அனுமதிக்கப்படவில்லை.
Namespace சார்ந்த dependents, cluster-scoped அல்லது namespaced உரிமையாளர்களை குறிப்பிடலாம்.
ஒரு namespaced உரிமையாளர் **கட்டாயமாக** dependent அதே namespace இல் இருக்க வேண்டும்.
இல்லையெனில், உரிமையாளர் குறிப்பு இல்லாதது போல் கருதப்பட்டு, அனைத்து உரிமையாளர்களும் இல்லை என்று உறுதிசெய்யப்பட்டால் dependent நீக்கப்படும்.

Cluster-scoped dependents, cluster-scoped உரிமையாளர்களை மட்டுமே குறிப்பிட முடியும்.
v1.20+ இல், ஒரு cluster-scoped dependent ஒரு namespaced kind ஐ உரிமையாளராக குறிப்பிட்டால், அது தீர்க்க முடியாத உரிமையாளர் குறிப்பாக கருதப்படும்.

v1.20+ இல், குப்பை சேகரிப்பான் தவறான cross-namespace `ownerReference` அல்லது namespaced kind ஐ குறிப்பிடும் cluster-scoped dependent ஐ கண்டறிந்தால், `OwnerRefInvalidNamespace` காரணத்துடன் எச்சரிக்கை Event அனுப்பப்படும்.
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace` மூலம் இதை சரிபார்க்கலாம்.
{{< /note >}}

## அடுக்கு நீக்கம் {#cascading-deletion}

Kubernetes, உரிமையாளர் குறிப்புகள் இல்லாத பொருட்களை சரிபார்த்து நீக்குகிறது — உதாரணமாக, ReplicaSet நீக்கப்பட்டபோது விடுபட்ட Pod கள்.
ஒரு பொருளை நீக்கும்போது, *அடுக்கு நீக்கம்* (cascading deletion) எனப்படும் செயல்முறையில் Kubernetes அதன் dependents ஐ தானாக நீக்குமா என்பதை நீங்கள் கட்டுப்படுத்தலாம்.
இரண்டு வகையான அடுக்கு நீக்கங்கள் உள்ளன:

* Foreground அடுக்கு நீக்கம்
* Background அடுக்கு நீக்கம்

உரிமையாளர் குறிப்புகள் உள்ள வளங்களை குப்பை சேகரிப்பான் எப்போது, எவ்வாறு நீக்குகிறது என்பதை Kubernetes {{<glossary_tooltip text="finalizers" term_id="finalizer">}} மூலம் கட்டுப்படுத்தலாம்.

### Foreground அடுக்கு நீக்கம் {#foreground-deletion}

Foreground அடுக்கு நீக்கத்தில், நீக்கப்படும் உரிமையாளர் பொருள் முதலில் *நீக்கம் நடவடிக்கையில்* என்ற நிலையில் நுழைகிறது.
இந்த நிலையில் உரிமையாளர் பொருளுக்கு பின்வருவன நடக்கும்:

* Kubernetes API சர்வர் பொருளின் `metadata.deletionTimestamp` புலத்தை நீக்கத்திற்கு குறிக்கப்பட்ட நேரத்திற்கு அமைக்கிறது.
* Kubernetes API சர்வர் `metadata.finalizers` புலத்தை `foregroundDeletion` என்று அமைக்கிறது.
* நீக்கம் முடியும்வரை பொருள் Kubernetes API மூலம் தெரியும்.

உரிமையாளர் பொருள் *நீக்கம் நடவடிக்கையில்* நிலையில் நுழைந்த பிறகு, controller தனக்குத் தெரிந்த dependents ஐ நீக்குகிறது.
தெரிந்த அனைத்து dependent பொருட்களையும் நீக்கிய பிறகு, controller உரிமையாளர் பொருளை நீக்குகிறது.
இப்போது பொருள் Kubernetes API இல் தெரியாது.

Foreground அடுக்கு நீக்கத்தில், `ownerReference.blockOwnerDeletion=true` புலம் உள்ள மற்றும் குப்பை சேகரிப்பான் cache இல் உள்ள dependents மட்டுமே உரிமையாளர் நீக்கத்தை தடுக்கும்.
மேலும் அறிய [Foreground அடுக்கு நீக்கம் பயன்படுத்துதல்](/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion) பார்க்கவும்.

### Background அடுக்கு நீக்கம் {#background-deletion}

Background அடுக்கு நீக்கத்தில், Kubernetes API சர்வர் உரிமையாளர் பொருளை உடனடியாக நீக்குகிறது,
பின்னர் குப்பை சேகரிப்பான் controller பின்னணியில் dependent பொருட்களை சுத்தம் செய்கிறது.
finalizer இருந்தால், அனைத்து தேவையான சுத்தம் செய்யும் பணிகளும் முடியும்வரை பொருட்கள் நீக்கப்படாமல் இருப்பதை உறுதிசெய்கிறது.
நீங்கள் foreground deletion கையாளவில்லை அல்லது dependents ஐ orphan செய்யவில்லை என்றால், Kubernetes இயல்பாக Background அடுக்கு நீக்கத்தை பயன்படுத்துகிறது.

மேலும் அறிய [Background அடுக்கு நீக்கம் பயன்படுத்துதல்](/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion) பார்க்கவும்.

### Orphan சார்புடையவர்கள்

Kubernetes ஒரு உரிமையாளர் பொருளை நீக்கும்போது, விடுபட்ட dependents *orphan* பொருட்கள் எனப்படும்.
இயல்பாக Kubernetes dependent பொருட்களை நீக்குகிறது.
இதை மாற்ற [உரிமையாளர் பொருட்களை நீக்கி dependents ஐ orphan செய்தல்](/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy) பார்க்கவும்.

## பயன்படுத்தப்படாத கொள்கலன்கள் மற்றும் படங்களின் குப்பை சேகரிப்பு {#containers-images}

{{<glossary_tooltip text="kubelet" term_id="kubelet">}} பயன்படுத்தப்படாத படங்களில் (images) ஒவ்வொரு ஐந்து நிமிடத்திற்கும், பயன்படுத்தப்படாத கொள்கலன்களில் (containers) ஒவ்வொரு நிமிடத்திற்கும் குப்பை சேகரிப்பு செய்கிறது.
kubelet நடத்தையை சேதப்படுத்தக்கூடும் என்பதால் வெளிப்புற குப்பை சேகரிப்பு கருவிகளை பயன்படுத்துவதை தவிர்க்கவும்.

பயன்படுத்தப்படாத கொள்கலன் மற்றும் படம் (image) குப்பை சேகரிப்பிற்கான விருப்பங்களை அமைக்க,
[configuration file](/docs/tasks/administer-cluster/kubelet-config-file/) மூலம் kubelet ஐ சரிசெய்து
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) resource type மூலம் குப்பை சேகரிப்பு அளவுருக்களை மாற்றவும்.

### கொள்கலன் படம் (Container image) வாழ்க்கைச் சுழற்சி

Kubernetes, {{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}} உடன் இணைந்து செயல்படும் kubelet இன் *image manager* மூலம் அனைத்து படங்களின் வாழ்க்கைச் சுழற்சியையும் நிர்வகிக்கிறது.
kubelet குப்பை சேகரிப்பு முடிவுகளை எடுக்கும்போது பின்வரும் வட்டு பயன்பாட்டு வரம்புகளை கருத்தில் கொள்கிறது:

* `HighThresholdPercent`
* `LowThresholdPercent`

`HighThresholdPercent` மதிப்பை தாண்டிய வட்டு பயன்பாடு குப்பை சேகரிப்பை தூண்டுகிறது,
இது கடைசியாக பயன்படுத்தப்பட்ட நேரத்தின் அடிப்படையில் (பழையவை முதலில்) படங்களை நீக்குகிறது.
வட்டு பயன்பாடு `LowThresholdPercent` மதிப்பை எட்டும்வரை kubelet படங்களை நீக்குகிறது.

#### பயன்படுத்தப்படாத கொள்கலன் படங்களுக்கான குப்பை சேகரிப்பு {#image-maximum-age-gc}

வட்டு பயன்பாட்டைப் பொருட்படுத்தாமல், ஒரு local படம் எவ்வளவு நேரம் பயன்படுத்தப்படாமல் இருக்கலாம் என்ற அதிகபட்ச நேரத்தை குறிப்பிடலாம்.
இது ஒவ்வொரு Node க்கும் நீங்கள் அமைக்கும் kubelet அமைப்பு.

இதை அமைக்க, kubelet configuration file இல் `imageMaximumGCAge` புலத்திற்கு மதிப்பு அமைக்க வேண்டும்.

மதிப்பு Kubernetes {{< glossary_tooltip text="duration" term_id="duration" >}} ஆக குறிப்பிடப்படுகிறது.
உதாரணமாக, `12h45m` என்று அமைக்கலாம், இது 12 மணி நேரம் 45 நிமிடங்களை குறிக்கிறது.

{{< note >}}
இந்த அம்சம் kubelet மறுதொடக்கம் (restart) முழுவதும் படம் பயன்பாட்டை கண்காணிக்காது.
kubelet மறுதொடக்கம் செய்யப்பட்டால், கண்காணிக்கப்பட்ட படம் வயது மீட்டமைக்கப்படும்,
இதனால் kubelet படம் வயதின் அடிப்படையில் குப்பை சேகரிப்பிற்கு தகுதியடைவதற்கு முன் `imageMaximumGCAge` காலம் முழுவதும் காத்திருக்கும்.
{{< /note>}}

### கொள்கலன் குப்பை சேகரிப்பு {#container-image-garbage-collection}

kubelet பின்வரும் மாறிகளின் அடிப்படையில் பயன்படுத்தப்படாத கொள்கலன்களை குப்பை சேகரிப்பு செய்கிறது:

* `MinAge`: kubelet ஒரு கொள்கலனை குப்பை சேகரிப்பு செய்யக்கூடிய குறைந்தபட்ச வயது. `0` என்று அமைத்து முடக்கலாம்.
* `MaxPerPodContainer`: ஒவ்வொரு Pod க்கும் இருக்கக்கூடிய அதிகபட்ச இறந்த கொள்கலன்கள். `0` க்கும் குறைவாக அமைத்து முடக்கலாம்.
* `MaxContainers`: கொத்தில் இருக்கக்கூடிய அதிகபட்ச இறந்த கொள்கலன்கள். `0` க்கும் குறைவாக அமைத்து முடக்கலாம்.

இந்த மாறிகளுக்கு கூடுதலாக, kubelet அடையாளமற்ற மற்றும் நீக்கப்பட்ட கொள்கலன்களை பொதுவாக பழையவை முதலில் என்ற வரிசையில் குப்பை சேகரிப்பு செய்கிறது.

`MaxPerPodContainer` மற்றும் `MaxContainers` ஆகியவை முரண்படும்போது, kubelet முரண்பாட்டை தீர்க்க `MaxPerPodContainer` ஐ சரிசெய்கிறது.
மோசமான நிலையில் `MaxPerPodContainer` `1` ஆக குறைக்கப்பட்டு பழைய கொள்கலன்கள் நீக்கப்படும்.
மேலும், நீக்கப்பட்ட Pod களுக்கு சொந்தமான கொள்கலன்கள் `MinAge` ஐ தாண்டியவுடன் நீக்கப்படும்.

{{<note>}}
kubelet தான் நிர்வகிக்கும் கொள்கலன்களை மட்டுமே குப்பை சேகரிப்பு செய்கிறது.
{{</note>}}

## குப்பை சேகரிப்பை அமைத்தல் {#configuring-gc}

வளங்களை நிர்வகிக்கும் controllers க்கு குறிப்பிட்ட விருப்பங்களை அமைப்பதன் மூலம் குப்பை சேகரிப்பை சரிசெய்யலாம்.
பின்வரும் பக்கங்கள் குப்பை சேகரிப்பை எவ்வாறு அமைப்பது என்று காட்டுகின்றன:

* [Kubernetes பொருட்களின் அடுக்கு நீக்கத்தை அமைத்தல்](/docs/tasks/administer-cluster/use-cascading-deletion/)
* [முடிந்த Jobs சுத்தம் செய்வதை அமைத்தல்](/docs/concepts/workloads/controllers/ttlafterfinished/)

## {{% heading "whatsnext" %}}

* [Kubernetes பொருட்களின் உரிமையுரிமை](/docs/concepts/overview/working-with-objects/owners-dependents/) பற்றி மேலும் அறியவும்.
* Kubernetes [finalizers](/docs/concepts/overview/working-with-objects/finalizers/) பற்றி மேலும் அறியவும்.
* முடிந்த Jobs ஐ சுத்தம் செய்யும் [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) பற்றி அறியவும்.
