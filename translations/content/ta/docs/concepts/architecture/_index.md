---
title: "கொத்து கட்டமைப்பு"
weight: 30
no_list: true
description: >
  Kubernetes-இன் கட்டமைப்பு கருத்துகள்.
---

ஒரு Kubernetes cluster (கொத்து) என்பது ஒரு control plane (கட்டுப்பாட்டு தளம்) மற்றும் nodes எனப்படும் பணியாளர் இயந்திரங்களின் தொகுப்பால் ஆனது; இந்த nodes கொள்கலன் (Container) வடிவிலான பயன்பாடுகளை இயக்குகின்றன. குறைந்தது ஒரு worker node இருந்தால் மட்டுமே Pods இயங்கும்.

Worker node(s) பயன்பாட்டின் பணிச்சுமை (Workload) கூறுகளான Pods-ஐ தங்கி வைக்கின்றன. கட்டுப்பாட்டு தளம் worker nodes மற்றும் cluster-இல் உள்ள Pods-ஐ நிர்வகிக்கிறது. உற்பத்தி சூழல்களில், கட்டுப்பாட்டு தளம் பொதுவாக பல கணினிகளில் இயங்கும்; cluster-உம் பல nodes-ஐக் கொண்டிருக்கும் — இது தவறு-சகிப்பு (fault-tolerance) மற்றும் உயர் கிடைக்கும் தன்மையை (high availability) வழங்கும்.

இந்த ஆவணம் ஒரு முழுமையான மற்றும் செயல்பாட்டு Kubernetes கொத்துக்கு தேவையான பல்வேறு கூறுகளை விவரிக்கிறது.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="The control plane (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) and several nodes. Each node is running a kubelet and kube-proxy." caption="படம் 1. Kubernetes கொத்து கூறுகள்." class="diagram-large" >}}

{{< details summary="இந்த கட்டமைப்பைப் பற்றி" >}}
படம் 1 ஒரு Kubernetes cluster-க்கான எடுத்துக்காட்டு குறிப்பு கட்டமைப்பை சித்தரிக்கிறது. கூறுகளின் உண்மையான விநியோகம் குறிப்பிட்ட cluster அமைப்புகள் மற்றும் தேவைகளைப் பொறுத்து மாறுபடலாம்.

படத்தில், ஒவ்வொரு node-உம் [`kube-proxy`](#kube-proxy) கூறை இயக்குகிறது. cluster network-இல் {{< glossary_tooltip text="Service" term_id="service">}} API மற்றும் அதன் நடத்தைகள் கிடைக்க, ஒவ்வொரு node-இலும் ஒரு network proxy கூறு தேவை. ஆனால், சில network plugins தங்கள் சொந்த third party proxying செயலாக்கத்தை வழங்குகின்றன — அவ்வகை plugin பயன்படுத்தும்போது `kube-proxy` தேவையில்லை.
{{< /details >}}

## கட்டுப்பாட்டு தளத்தின் கூறுகள் {#control-plane-components}

கட்டுப்பாட்டு தளத்தின் கூறுகள் cluster-அளவிலான முடிவுகளை (எடுத்துக்காட்டாக, திட்டமிடல்) எடுக்கின்றன, மேலும் cluster நிகழ்வுகளை கண்டறிந்து பதிலளிக்கின்றன (எடுத்துக்காட்டாக, ஒரு Deployment-இன் `{{< glossary_tooltip text="replicas" term_id="replica" >}}` புலம் நிறைவேறாதபோது புதிய {{< glossary_tooltip text="pod" term_id="pod">}} தொடங்குதல்).

கட்டுப்பாட்டு தளத்தின் கூறுகள் cluster-இல் உள்ள எந்த இயந்திரத்திலும் இயங்கலாம். எளிமைக்காக, அமைவு scripts பொதுவாக அனைத்து கூறுகளையும் ஒரே இயந்திரத்தில் தொடங்கும், மேலும் அந்த இயந்திரத்தில் பயனர் கொள்கலன்களை இயக்காது.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

பல வகையான controllers உள்ளன. சில எடுத்துக்காட்டுகள்:

- Node controller: nodes செயலிழக்கும்போது கவனித்து பதிலளிக்கும்.
- Job controller: ஒருமுறை இயங்கும் பணிகளை குறிக்கும் Job objects-ஐ கண்காணித்து, அந்த பணிகளை நிறைவு செய்ய Pods-ஐ உருவாக்கும்.
- EndpointSlice controller: Services மற்றும் Pods-க்கு இடையில் இணைப்பு வழங்க EndpointSlice objects-ஐ நிரப்பும்.
- ServiceAccount controller: புதிய namespaces-க்கு இயல்புநிலை ServiceAccounts உருவாக்கும்.

மேலே உள்ளது முழுமையான பட்டியல் அல்ல.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

cloud-controller-manager உங்கள் cloud provider-க்கு குறிப்பிட்ட controllers மட்டுமே இயக்கும். நீங்கள் Kubernetes-ஐ உங்கள் சொந்த வளாகத்தில் அல்லது கற்றல் சூழலில் இயக்கினால், cluster-இல் cloud controller manager இருக்காது.

kube-controller-manager போலவே, cloud-controller-manager பல தர்க்க ரீதியான சுழல்களை ஒரே binary-ஆக இணைக்கிறது. செயல்திறனை மேம்படுத்த அல்லது தோல்விகளை சகிக்க கிடைமட்டமாக அளவிடலாம் (ஒன்றுக்கு மேற்பட்ட நகல் இயக்கலாம்).

cloud provider சார்புகள் கொண்ட controllers:

- Node controller: node பதில் நிறுத்திய பிறகு cloud-இல் நீக்கப்பட்டதா என சரிபார்க்க.
- Route controller: அடிப்படை cloud உள்கட்டமைப்பில் routes அமைக்க.
- Service controller: cloud provider load balancers உருவாக்க, புதுப்பிக்க, நீக்க.

## Node கூறுகள் {#node-components}

Node கூறுகள் ஒவ்வொரு node-இலும் இயங்கி, pods-ஐ இயக்கும் நிலையில் வைத்திருக்கின்றன மற்றும் Kubernetes runtime சூழலை வழங்குகின்றன.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy (விரும்பினால்) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}

நீங்கள் Services-க்கான packet forwarding-ஐ தானே செயல்படுத்தும் ஒரு [network plugin](#network-plugins) பயன்படுத்தினால், cluster-இல் உள்ள nodes-இல் kube-proxy இயக்க வேண்டியதில்லை.

### Container runtime (கொள்கலன் runtime)

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Addons cluster அளவிலான அம்சங்களை செயல்படுத்த Kubernetes வளங்களை ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, முதலியன) பயன்படுத்துகின்றன. இவை cluster அளவிலான அம்சங்களை வழங்குவதால், addons-க்கான namespaced resources `kube-system` namespace-இல் சேரும்.

### DNS

மற்ற addons கட்டாயமில்லாவிட்டாலும், அனைத்து Kubernetes clusters-உம் [cluster DNS](/docs/concepts/services-networking/dns-pod-service/) கொண்டிருக்க வேண்டும் — பல எடுத்துக்காட்டுகள் அதை நம்பியுள்ளன.

Cluster DNS என்பது உங்கள் சூழலில் உள்ள மற்ற DNS servers-க்கு கூடுதலாக ஒரு DNS server ஆகும், இது Kubernetes services-க்கான DNS records வழங்கும். Kubernetes தொடங்கிய Containers தானாகவே இந்த DNS server-ஐ தங்கள் DNS searches-இல் சேர்க்கும்.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) ஒரு பொது நோக்கிலான, web-அடிப்படையிலான Kubernetes clusters-க்கான UI ஆகும். இது cluster-இல் இயங்கும் பயன்பாடுகளையும் cluster-ஐயும் நிர்வகிக்கவும் சரிசெய்யவும் உதவுகிறது.

### Container வள கண்காணிப்பு

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) containers-பற்றிய பொதுவான time-series metrics-ஐ ஒரு மையல் தரவுத்தளத்தில் பதிவு செய்து, அந்த தரவை உலாவ UI வழங்குகிறது.

### Cluster அளவிலான Logging

[Cluster அளவிலான logging](/docs/concepts/cluster-administration/logging/) வழிமுறை container logs-ஐ தேடல்/உலாவல் இடைமுகம் கொண்ட ஒரு மைய log store-இல் சேமிக்க பொறுப்பாகும்.

### Network plugins

[Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins) என்பவை container network interface (CNI) specification-ஐ செயல்படுத்தும் மென்பொருள் கூறுகள். இவை pods-க்கு IP முகவரிகளை ஒதுக்கி, cluster-இல் ஒன்றுடன் ஒன்று தொடர்பு கொள்ள இயக்குகின்றன.

## கட்டமைப்பு மாறுபாடுகள் {#architecture-variations}

Kubernetes-இன் மைய கூறுகள் நிலையாக இருந்தாலும், அவை எவ்வாறு பயன்படுத்தப்பட்டு நிர்வகிக்கப்படுகின்றன என்பது மாறுபடலாம்.

### கட்டுப்பாட்டு தள பயன்படுத்தல் விருப்பங்கள்

கட்டுப்பாட்டு தளத்தின் கூறுகளை பல வழிகளில் பயன்படுத்தலாம்:

பாரம்பரிய பயன்படுத்தல்
: கூறுகள் நேரடியாக அர்ப்பணிக்கப்பட்ட இயந்திரங்கள் அல்லது VMs-இல் இயங்கும், பொதுவாக systemd services ஆக நிர்வகிக்கப்படும்.

Static Pods
: கூறுகள் static Pods ஆக பயன்படுத்தப்படும், குறிப்பிட்ட nodes-இல் kubelet நிர்வகிக்கும். kubeadm போன்ற கருவிகள் இந்த அணுகுமுறையை பயன்படுத்துகின்றன.

Self-hosted
: கட்டுப்பாட்டு தளம் Kubernetes cluster-க்குள்ளேயே Pods ஆக இயங்கும், Deployments மற்றும் StatefulSets நிர்வகிக்கும்.

நிர்வகிக்கப்பட்ட Kubernetes சேவைகள்
: Cloud providers கட்டுப்பாட்டு தளத்தை தங்கள் சேவையின் ஒரு பகுதியாக நிர்வகிக்கின்றன.

### பணிச்சுமை வைப்பிட பரிசீலனைகள்

- சிறிய அல்லது வளர்ச்சி clusters-இல், கட்டுப்பாட்டு தள கூறுகளும் பயனர் பணிச்சுமைகளும் ஒரே nodes-இல் இயங்கலாம்.
- பெரிய உற்பத்தி clusters பொதுவாக கட்டுப்பாட்டு தள கூறுகளுக்கு குறிப்பிட்ட nodes-ஐ அர்ப்பணிக்கின்றன — பயனர் பணிச்சுமைகளிலிருந்து பிரிக்கின்றன.
- சில நிறுவனங்கள் கட்டுப்பாட்டு தள nodes-இல் முக்கியமான add-ons அல்லது கண்காணிப்பு கருவிகளை இயக்குகின்றன.

### Cluster நிர்வாக கருவிகள்

kubeadm, kops, மற்றும் Kubespray போன்ற கருவிகள் clusters-ஐ பயன்படுத்தி நிர்வகிக்க வெவ்வேறு அணுகுமுறைகளை வழங்குகின்றன.

### தனிப்பயனாக்கம் மற்றும் நீட்டிப்பு தன்மை

Kubernetes கட்டமைப்பு குறிப்பிடத்தக்க தனிப்பயனாக்கத்தை அனுமதிக்கிறது:

- Custom schedulers இயல்புநிலை Kubernetes திட்டமிடுபவர் (Scheduler)-க்கு அருகில் அல்லது அதற்கு பதிலாக பயன்படுத்தலாம்.
- API servers-ஐ CustomResourceDefinitions மற்றும் API Aggregation மூலம் நீட்டிக்கலாம்.
- Cloud providers cloud-controller-manager மூலம் Kubernetes-உடன் ஆழமாக ஒருங்கிணைக்கலாம்.

Kubernetes கட்டமைப்பின் நெகிழ்வுத்தன்மை நிறுவனங்களுக்கு தங்கள் clusters-ஐ குறிப்பிட்ட தேவைகளுக்கு ஏற்ப மாற்றவும், செயல்பாட்டு சிக்கலானது, செயல்திறன், மற்றும் நிர்வாக மேல்நிலை ஆகியவற்றை சமனப்படுத்தவும் உதவுகிறது.

## {{% heading "whatsnext" %}}

பின்வருவனவற்றை மேலும் அறியுங்கள்:

- [Nodes](/docs/concepts/architecture/nodes/) மற்றும்
  கட்டுப்பாட்டு தளத்துடன் [அவற்றின் தொடர்பு](/docs/concepts/architecture/control-plane-node-communication/).
- Kubernetes [controllers](/docs/concepts/architecture/controller/).
- Cluster objects-இன் [Garbage collection](/docs/concepts/architecture/garbage-collection/).
- Kubernetes-க்கான இயல்புநிலை திட்டமிடுபவர் [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/).
- Etcd-இன் அதிகாரப்பூர்வ [ஆவணம்](https://etcd.io/docs/).
- Kubernetes-இல் பல [container runtimes](/docs/setup/production-environment/container-runtimes/).
- [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/) மூலம் cloud providers-உடன் ஒருங்கிணைத்தல்.
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands) கட்டளைகள்.
