---
reviewers:
- lavalamp
title: Kubernetes கூறுகள்
content_type: concept
description: >
  ஒரு Kubernetes கொத்தை (Cluster) உருவாக்கும் முக்கிய கூறுகளின் மேலோட்டம்.
weight: 10
card:
  title: கொத்தின் கூறுகள்
  name: concepts
  weight: 20
---

<!-- overview -->
இந்தப் பக்கம் ஒரு Kubernetes கொத்தை (Cluster) உருவாக்கும் அத்தியாவசியமான கூறுகளின் உயர்நிலை மேலோட்டத்தை வழங்குகிறது.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="ஒரு Kubernetes கொத்தின் கூறுகள்" class="diagram-large" clicktozoom="true" >}}

<!-- body -->
## முக்கிய கூறுகள்

ஒரு Kubernetes கொத்து (Cluster) ஒரு கட்டுப்பாட்டு தளம் (Control Plane) மற்றும் ஒன்று அல்லது அதற்கு மேற்பட்ட பணியாளர் Node-களால் ஆனது. முக்கிய கூறுகளின் சுருக்கமான மேலோட்டம் இங்கே தரப்பட்டுள்ளது:

### கட்டுப்பாட்டு தளக் கூறுகள்

கொத்தின் (Cluster) ஒட்டுமொத்த நிலையை நிர்வகிக்கின்றன:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: Kubernetes HTTP API-ஐ வெளிப்படுத்தும் மையக் கூறு சேவையகம்.

[etcd](/docs/concepts/architecture/#etcd)
: அனைத்து API சேவையக தரவுகளுக்கும் உரிய நிலையான மற்றும் அதிக-கிடைக்கக்கூடிய திறவு-மதிப்பு (key value) சேமிப்பகம்.

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: இன்னும் எந்த Node-உடனும் இணைக்கப்படாத Pod-களைத் தேடி, ஒவ்வொரு Pod-ஐயும் பொருத்தமான Node-உடன் இணைக்கிறது.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Kubernetes API நடத்தையை செயல்படுத்த {{< glossary_tooltip text="controllers" term_id="controller" >}}-களை இயக்குகிறது.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (விரும்பினால்)
: அடிப்படையிலுள்ள மேகக் கணினி வழங்குநர்களுடன் (cloud provider) ஒருங்கிணைகிறது.

### Node கூறுகள்

ஒவ்வொரு Node-லும் இயங்கி, இயங்கும் Pod-களைப் பராமரிக்கின்றன மற்றும் Kubernetes இயக்க சூழலை வழங்குகின்றன:

[kubelet](/docs/concepts/architecture/#kubelet)
: Pod-கள் தங்கள் கொள்கலன்கள் (Containers) உட்பட இயங்குகின்றன என்பதை உறுதிசெய்கிறது.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (விரும்பினால்)
: சேவைகளை (Services) செயல்படுத்த Node-களில் பிணைய விதிகளை {{< glossary_tooltip text="Services" term_id="service" >}} பராமரிக்கிறது.

[Container runtime](/docs/concepts/architecture/#container-runtime)
: கொள்கலன்களை (Containers) இயக்குவதற்குப் பொறுப்பான மென்பொருள். மேலும் அறிய [Container Runtimes](/docs/setup/production-environment/container-runtimes/) படிக்கவும்.

## கூடுதல் செருகிகள் (Addons)

Addons, Kubernetes-இன் செயல்பாட்டை விரிவாக்குகின்றன. சில முக்கியமான எடுத்துக்காட்டுகள்:

[DNS](/docs/concepts/architecture/#dns) : கொத்து அளவிலான (cluster-wide) DNS தெளிவாக்கத்திற்காக.
[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard) : வலை இடைமுகம் மூலம் கொத்தை (Cluster) நிர்வகிக்க.
[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring) : கொள்கலன் (Container) அளவீடுகளை சேகரிக்கவும் சேமிக்கவும்.
[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging) : கொள்கலன் (Container) பதிவுகளை மையமான பதிவு சேமிப்பகத்தில் சேமிக்க.

## கட்டமைப்பில் நெகிழ்வுத்தன்மை

இந்தக் கூறுகள் எவ்வாறு பயன்படுத்தப்பட்டு நிர்வகிக்கப்படுகின்றன என்பதில் Kubernetes நெகிழ்வுத்தன்மையை அனுமதிக்கிறது. சிறிய மேம்பாட்டு சூழல்கள் முதல் பெரிய அளவிலான உற்பத்தி பயன்படுத்தல்கள் வரை பல்வேறு தேவைகளுக்கு ஏற்ப கட்டமைப்பை (Architecture) மாற்றியமைக்கலாம்.

ஒவ்வொரு கூறு பற்றிய விரிவான தகவல்களுக்கும், உங்கள் கொத்து கட்டமைப்பை (Cluster Architecture) உள்ளமைவு (Configuration) செய்வதற்கான பல்வேறு வழிகளுக்கும், [Cluster Architecture](/docs/concepts/architecture/) பக்கத்தைப் பார்க்கவும்.
