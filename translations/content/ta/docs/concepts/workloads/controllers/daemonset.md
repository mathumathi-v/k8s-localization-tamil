---
reviewers:
- enisoc
- erictune
title: DaemonSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "DaemonSet"
description: >-
  ஒரு DaemonSet என்பது அனைத்து (அல்லது சில) Node-களிலும் ஒரு Pod நகலை இயக்குவதை உறுதி செய்கிறது.
content_type: concept
weight: 40
hide_summary: true # Listed separately in section index
---

<!-- overview -->

ஒரு _DaemonSet_ அனைத்து (அல்லது சில) Node-களும் ஒரு Pod நகலை இயக்குவதை உறுதி செய்கிறது. கொத்துக்கு (Cluster) Node-கள் சேர்க்கப்படும்போது, அவற்றில் Pod-கள் சேர்க்கப்படுகின்றன. Node-கள் கொத்திலிருந்து நீக்கப்படும்போது, அந்த Pod-கள் குப்பை சேகரிப்பு (garbage collection) மூலம் அகற்றப்படுகின்றன. ஒரு DaemonSet-ஐ நீக்குவது அது உருவாக்கிய Pod-களை சுத்தம் செய்யும்.

DaemonSet-இன் சில வழக்கமான பயன்பாடுகள்:

- ஒவ்வொரு Node-லும் கொத்து சேமிப்பக இயக்ககத்தை (cluster storage daemon) இயக்குதல்
- ஒவ்வொரு Node-லும் பதிவு சேகரிப்பு இயக்ககத்தை (logs collection daemon) இயக்குதல்
- ஒவ்வொரு Node-லும் Node கண்காணிப்பு இயக்ககத்தை (node monitoring daemon) இயக்குதல்

எளிய வழக்கில், ஒவ்வொரு வகை இயக்ககத்தையும் உள்ளடக்கிய ஒரு DaemonSet அனைத்து Node-களிலும் பயன்படுத்தப்படும். மிகவும் சிக்கலான அமைப்பு வெவ்வேறு வன்பொருளுக்காக வெவ்வேறு flags மற்றும்/அல்லது வெவ்வேறு வகை Node-களுக்காக வெவ்வேறு memory மற்றும் cpu கோரிக்கைகளுடன் ஒரே வகை இயக்ககத்திற்கு பல DaemonSet-களை பயன்படுத்தலாம்.

<!-- body -->

## DaemonSet Spec எழுதுதல் {#writing-a-daemonset-spec}

### ஒரு DaemonSet உருவாக்குதல் {#create-a-daemonset}

நீங்கள் YAML கோப்பில் ஒரு DaemonSet-ஐ விவரிக்கலாம். எடுத்துக்காட்டாக, கீழே உள்ள `daemonset.yaml` கோப்பு `fluentd-elasticsearch` Docker image-ஐ இயக்கும் DaemonSet-ஐ விவரிக்கிறது:

{{% code_sample file="controllers/daemonset.yaml" %}}

YAML கோப்பை அடிப்படையாகக் கொண்டு DaemonSet-ஐ உருவாக்கவும்:

```
kubectl apply -f https://k8s.io/examples/controllers/daemonset.yaml
```

### தேவையான புலங்கள் {#required-fields}

மற்ற எல்லா Kubernetes உள்ளமைவுகளைப் போலவே, ஒரு DaemonSet-க்கு `apiVersion`, `kind`, மற்றும் `metadata` புலங்கள் தேவை. எல்லா உள்ளமைவு கோப்புகளுடனும் பணிபுரிவதைப் பற்றிய பொதுவான தகவலுக்கு,
{{< glossary_tooltip term_id="object-management" >}} பார்க்கவும்.

ஒரு DaemonSet பொருளின் பெயர் சரியான
[DNS subdomain பெயராக](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) இருக்க வேண்டும்.

ஒரு DaemonSet-க்கு [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) பிரிவும் தேவை.

### Pod Template {#pod-template}

`.spec.template` என்பது `.spec`-இல் தேவையான புலங்களில் ஒன்றாகும்.

`.spec.template` என்பது ஒரு {{< glossary_tooltip text="Pod template" term_id="pod-template" >}} ஆகும். இது `.spec.template.metadata` மற்றும் `.spec.template.spec` போன்ற உள்ளமைக்கப்பட்ட புலங்களைக் கொண்டிருப்பதைத் தவிர, [Pod](/docs/concepts/workloads/pods/)-க்கு அதே schema உள்ளது.

`.spec.template.spec.restartPolicy`-ன் மதிப்பு `Always` ஆக இருக்க வேண்டும், இது இயல்புநிலை மதிப்பு ஆகும்.

### Pod Selector {#pod-selector}

`.spec.selector` புலம் ஒரு Pod தேர்வாளர் (Pod Selector) ஆகும். இது [Job](/docs/concepts/workloads/controllers/job/)-இல் உள்ள `.spec.selector`-ஐப் போலவே செயல்படுகிறது.

Kubernetes {{< skew currentVersion >}}-இன் நிலவரப்படி, `.spec.selector` குறிப்பிடப்படவில்லை என்றால், `.spec.template.metadata.labels`-ன் அடிப்படையில் இது இயல்பாக அமைக்கப்படும். இருப்பினும், இயல்புநிலை selector தொகுப்பு எதிர்காலத்தில் நீக்கப்படக்கூடும், எனவே `.spec.selector`-ஐ வெளிப்படையாக குறிப்பிடுவது சிறந்தது.

`.spec.selector` என்பது இரண்டு புலங்களைக் கொண்ட ஒரு object:

* `matchLabels` - [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)-இல் உள்ள `.spec.selector`-ஐப் போலவே செயல்படுகிறது.
* `matchExpressions` - key, மதிப்புகளின் பட்டியல், மற்றும் key மற்றும் மதிப்புகளுடன் தொடர்புடைய operator ஆகியவற்றை குறிப்பிடுவதன் மூலம் மிகவும் சிக்கலான தேர்வாளர்களை (Selector) உருவாக்க அனுமதிக்கிறது.

இரண்டு புலங்களும் குறிப்பிடப்படும்போது, இரண்டு நிபந்தனைகளும் AND செய்யப்படுகின்றன.

`.spec.selector` `.spec.template.metadata.labels`-ஐ பொருந்த வேண்டும். இந்த இரண்டும் பொருந்தாவிட்டால் API மூலம் நிராகரிக்கப்படும்.

### தேர்ந்த Node-களில் Pod-களை இயக்குதல் {#running-pods-on-select-nodes}

ஒரு DaemonSet-க்கு `.spec.template.spec.nodeSelector` குறிப்பிட்டால், DaemonSet கட்டுப்படுத்தி (DaemonSet controller) அந்த [node selector](/docs/concepts/scheduling-eviction/assign-pod-node/) பொருந்தும் Node-களில் Pod-களை உருவாக்கும். அதேபோல், `.spec.template.spec.affinity` குறிப்பிட்டால், DaemonSet கட்டுப்படுத்தி அந்த [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/) பொருந்தும் Node-களில் Pod-களை உருவாக்கும். அதில் எதுவும் குறிப்பிடப்படவில்லை என்றால், DaemonSet கட்டுப்படுத்தி அனைத்து Node-களிலும் Pod-களை உருவாக்கும்.

## Daemon Pod-கள் எவ்வாறு திட்டமிடப்படுகின்றன {#how-daemon-pods-are-scheduled}

ஒரு DaemonSet அனைத்து தகுதியான Node-களிலும் Pod-களைக் கொண்டிருப்பதை உறுதி செய்கிறது. DaemonSet கட்டுப்படுத்தி ஒவ்வொரு தகுதியான Node-க்கும் ஒரு Pod உருவாக்குகிறது. DaemonSet Pod-களை அனுமதிக்க (admit) தகுதியான Node-கள் பின்வரும் தேவைகளை பூர்த்தி செய்ய வேண்டும்:
- `.spec.selector` பொருந்தும் Node-கள்
- கீழே விவரிக்கப்பட்டுள்ள taint/toleration சரிபார்ப்பை நிறைவேற்றும் Node-கள்

DaemonSet Pod-கள் உருவாக்கப்பட்டு திட்டமிட்டாளர் (Scheduler) அவற்றை திட்டமிடும் முன்பே, kube-scheduler பொதுவாக Pod-களை Node-களில் வைப்பதை கட்டுப்படுத்துகிறது. இருப்பினும், DaemonSet Pod-கள் DaemonSet கட்டுப்படுத்தியால் உருவாக்கப்பட்டு திட்டமிட்டாளர் அவற்றை திட்டமிடுகிறது. இது பின்வரும் சிக்கல்களுக்கு வழிவகுக்கலாம்:
- **Pod-கள் Node நிலை மீது நம்பத்தகாத நடத்தை**: திட்டமிட்டாளர் Node-ஐ `Unschedulable` என்று குறித்திருந்தாலும், DaemonSet Pod-கள் Node-ஐ சென்றடைய வேண்டும்.
- **கொத்தின் திட்டமிடல் திறன் குறைந்தாலும் Daemon Pod-கள் வெளியேற்றப்படாமல் இருக்க வேண்டும்**.

DaemonSet Pod-கள் திட்டமிட்டாளரால் திட்டமிடப்படுகின்றன, DaemonSet கட்டுப்படுத்தியால் அல்ல. DaemonSet கட்டுப்படுத்தி `.spec.nodeName` புலத்தை அமைக்காமல், Kubernetes திட்டமிட்டாளரால் Pod-ஐ எல்லா தகுதியான Node-களிலும் திட்டமிட முடியும்.

## Taint-கள் மற்றும் Toleration-கள் {#taints-and-tolerations}

DaemonSet கட்டுப்படுத்தி தானாகவே DaemonSet spec-ல் வரையறுக்கப்பட்ட Node condition-கள் வரையறுக்கும்
[taint tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
ஐ Pod-களில் சேர்க்கிறது:

| Toleration key | Effect | விளக்கம் |
| --- | --- | --- |
| `node.kubernetes.io/not-ready` | `NoExecute` | DaemonSet Pod-கள் Node ஆரோக்கியமற்றதாக இருந்தாலும் அவற்றில் இயங்க முடியும், உதாரணமாக network partition நடக்கும்போது. |
| `node.kubernetes.io/unreachable` | `NoExecute` | DaemonSet Pod-கள் Node-அடையமுடியாமல் போனாலும் அவற்றில் இயங்க முடியும். |
| `node.kubernetes.io/disk-pressure` | `NoSchedule` | DaemonSet Pod-கள் disk-pressure சிக்கல்கள் உள்ள Node-களில் திட்டமிடலாம். |
| `node.kubernetes.io/memory-pressure` | `NoSchedule` | DaemonSet Pod-கள் memory-pressure சிக்கல்கள் உள்ள Node-களில் திட்டமிடலாம். |
| `node.kubernetes.io/pid-pressure` | `NoSchedule` | DaemonSet Pod-கள் process-pressure சிக்கல்கள் உள்ள Node-களில் திட்டமிடலாம். |
| `node.kubernetes.io/unschedulable` | `NoSchedule` | DaemonSet Pod-கள் திட்டமிட முடியாத (unschedulable) Node-களில் திட்டமிடலாம். |
| `node.kubernetes.io/network-unavailable` | `NoSchedule` | **host network பயன்படுத்தும் DaemonSet Pod-களுக்கு மட்டும் சேர்க்கப்படுகிறது**, அதாவது `.spec.hostNetwork: true` என அமைக்கப்படும்போது. இந்த சூழ்நிலையில் network unavailable நிலையில் உள்ள Node-களில் DaemonSet Pod-கள் திட்டமிடலாம். |

இந்த toleration-களை மேலே எழுதலாம் அல்லது DaemonSet spec-ல் தனிப்பட்ட toleration-களை சேர்க்கலாம்.

DaemonSet கட்டுப்படுத்தி `node.kubernetes.io/unschedulable:NoSchedule` toleration-ஐ தானாகவே சேர்ப்பதால், Kubernetes unschedulable என குறிக்கப்பட்ட Node-களில் DaemonSet Pod-களை இயக்க முடியும்.

[கண்காணிப்பு கொத்துக்கு](/docs/concepts/architecture/#control-plane) பொருத்தமான DaemonSet-களை Node-களில் இயக்க, அல்லது கண்காணிப்பு Node node isolation/restriction அம்சத்தை அனுமதிக்க விரும்பாமலிருந்தால், நீங்கள் cluster-adm அல்லது master toleration-ஐ குறிப்பிட வேண்டியிருக்கும்.

## Daemon Pod-களுடன் தொடர்பு கொள்ளுதல் {#communicating-with-daemon-pods}

ஒரு DaemonSet-இல் உள்ள Pod-களுடன் தொடர்பு கொள்ள சில முறைகள்:

- **Push**: DaemonSet-இல் உள்ள Pod-கள் புள்ளியியல் தரவை சேகரிக்கும் சேவைக்கு புதுப்பிப்புகளை அனுப்ப உள்ளமைக்கப்படுகின்றன. Client இல்லை.
- **NodeIP மற்றும் Known Port**: DaemonSet-இல் உள்ள Pod-கள் `hostPort`-ஐ பயன்படுத்தலாம், இதனால் Node IP-வழியாக Pod-களை அணுகலாம். Client-கள் Node IP-ஐ எப்படியோ அறியும் மற்றும் port-ஐ மரபு வழியில் அறியும்.
- **DNS**: ஒரே selector கொண்ட [headless service](/docs/concepts/services-networking/service/#headless-services) உருவாக்கவும், பின்னர் `endpoints` வளங்களைப் பயன்படுத்தி அல்லது DNS-லிருந்து பல A records மீட்டெடுக்கவும்.
- **Service**: ஒரே selector கொண்ட ஒரு Service உருவாக்கவும், மேலும் Service-ஐ சீரற்ற Node-இல் உள்ள DaemonSet-இல் ஒரு daemon-ஐ அடைய பயன்படுத்தவும் (எந்த குறிப்பிட்ட Node-ஐ அடைய வழி இல்லை).

## DaemonSet-ஐ புதுப்பித்தல் {#updating-a-daemonset}

Node-ன் முத்திரைகள் (Labels) மாற்றப்பட்டால், DaemonSet புதிய பொருந்தும் Node-களில் உடனடியாக Pod-களை சேர்க்கும், பொருந்தாத Node-களிலிருந்து Pod-களை நீக்கும்.

ஒரு DaemonSet உருவாக்கும் Pod-களை மாற்றலாம். இருப்பினும், Pod-கள் அனைத்து template புலங்களையும் புதுப்பிப்பதை அனுமதிக்கவில்லை. மேலும், DaemonSet கட்டுப்படுத்தி Node-களை ஒரு unique பெயருடன் மட்டுமே பயன்படுத்துகிறது.

ஒரு DaemonSet-ஐ நீக்கலாம். `kubectl`-ஐ `--cascade=orphan` உடன் பயன்படுத்தினால், DaemonSet-ன் Pod-கள் Node-களில் விடப்படும். பின்னர் வேறு selector கொண்ட புதிய DaemonSet உருவாக்கினால், புதிய DaemonSet ஏற்கனவே உள்ள Pod-களை ஏற்றுக்கொள்ளும். Pod-களை மாற்ற வேண்டும் என்றால் DaemonSet-ஐ மாற்றவும்.

DaemonSet-கள் [rolling updates](/docs/tasks/manage-daemon/update-daemon-set/)-ஐ ஆதரிக்கின்றன.

## DaemonSet-களுக்கான மாற்றுகள் {#alternatives-to-daemonset}

### Init Scripts {#init-scripts}

Node-ன் ஒவ்வொரு துவக்க செயல்பாட்டிலும் (init scripts) daemon செயல்முறைகளை நேரடியாக இயக்குவது சாத்தியமே (உதாரணமாக `init`, `upstartd`, அல்லது `systemd` பயன்படுத்தி). DaemonSet-களைப் பயன்படுத்துவதில் இந்த முறைகளுக்கு மேல் பல நன்மைகள் உள்ளன:

- Application-களைப் போலவே daemon-களின் logs-ஐ கண்காணிக்கவும் நிர்வகிக்கவும் திறன்.
- Daemon-கள் மற்றும் applications-களுக்கு ஒரே உள்ளமைவு மொழி மற்றும் கருவிகள் (உதாரணமாக Pod templates, `kubectl`).
- வளங்களின் கட்டுப்பாட்டுடன் கொள்கலன்களில் (Containers) daemon-களை இயக்குவது, daemon-களிடமிருந்து app கொள்கலன்களை தனிமைப்படுத்த அதிக நெகிழ்வுத்தன்மையை அளிக்கிறது. இருப்பினும், இதை Pod-ல் அல்லாமல் கொள்கலனில் daemon-ஐ இயக்குவதன் மூலம் அடைய முடியும் (உதாரணமாக Docker-ஐ நேரடியாக பயன்படுத்தி).

### Bare Pod-கள் {#bare-pods}

Node-க்கு ஒரு Pod-ஐ குறிப்பிட்டு நேரடியாக உருவாக்குவது சாத்தியமே. இருப்பினும், Node-ன் சோர்வு, reboot, அல்லது kernel upgrade போன்ற காரணங்களால் Pod நிறுத்தப்பட்டால் அது மீட்டெடுக்கப்படாது. DaemonSet-ஐ அந்த Node-ல் இந்த pod-ஐ திட்டமிட பயன்படுத்துவது அதிக வலிமையான அணுகுமுறையாகும்.

### Static Pod-கள் {#static-pods}

Kubelet-ஆல் கண்காணிக்கப்படும் ஒரு குறிப்பிட்ட தொகுப்பில் கோப்புகளை எழுதுவதன் மூலம் Pod-களை உருவாக்குவது சாத்தியமே. இவை [static pods](/docs/tasks/configure-pod-container/static-pod/) என அழைக்கப்படுகின்றன. DaemonSet-களைப் போலல்லாமல், static pods-ஐ kubectl அல்லது பிற Kubernetes API clients மூலம் நிர்வகிக்க முடியாது. Static pods-கள் kube-apiserver-ஐ சார்ந்திருக்காது, இது சில bootstrap சூழல்களில் நன்மையாக இருக்கலாம். மேலும், static pods-கள் எதிர்காலத்தில் நீக்கப்படலாம்.

### Deployment-கள் {#deployments}

DaemonSet-கள் [Deployment-கள்](/docs/concepts/workloads/controllers/deployment/) மற்றும் [StatefulSet-கள்](/docs/concepts/workloads/controllers/statefulset/) போன்றவற்றுடன் ஒத்திருக்கின்றன, அனைத்தும் Pod-களை உருவாக்குகின்றன, மேலும் அந்த Pod-கள் மீட்டெடுக்கப்படுவதை எதிர்பார்க்கப்படாத முடிவுகள் பெற்றால் உறுதி செய்கின்றன.

Frontend-கள் போன்ற எந்த Node-ல் இயங்குகிறது என்று முக்கியமில்லாத நிலையற்ற சேவைகளுக்கு Deployment-களைப் பயன்படுத்தவும், replicas-ஐ அளவிடுவதும் upgrading-ஐ கட்டுப்படுத்துவதும் ஒவ்வொரு குறிப்பிட்ட host type-க்கும் ஒரு Pod copy-ஐ இயக்குவதைவிட முக்கியமானதாக உள்ளது.

Node infrastructure management-க்கு தொடர்புடைய சேவைகளுக்கு DaemonSet-ஐ பயன்படுத்தவும் - வழக்கமாக அனைத்து Node-களிலும் அல்லது குறிப்பிட்ட வகை Node-களிலும் நீங்கள் அந்த Pod-ஐ இயக்க விரும்புவீர்கள்.

## {{% heading "whatsnext" %}}

* [DaemonSet-கள் செய்யக்கூடிய முறைகள் பற்றி அறிக](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Daemon Pod-களை திட்டமிடுவது பற்றி அறிக](/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)
* [DaemonSet-ஐ நிர்வகிப்பது](/docs/tasks/manage-daemon/)
* [DaemonSet-ஐ rolling update செய்வது](/docs/tasks/manage-daemon/update-daemon-set/)
* [DaemonSet rolling update-ஐ rollback செய்வது](/docs/tasks/manage-daemon/rollback-daemon-set/)
* [DaemonSet-களில் taint மற்றும் toleration பற்றி அறிக](/docs/concepts/scheduling-eviction/taint-and-toleration/)
