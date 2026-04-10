---
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
---

<!-- overview -->
Kubernetes உங்கள் பணிச்சுமையை (Workload) நிர்வகிக்க, கொள்கலன்களை (Containers) Pods-இல் வைத்து _Nodes_-இல் இயக்குகிறது. ஒரு Node என்பது கொத்தின் (Cluster) தன்மையைப் பொறுத்து மெய்நிகர் அல்லது இயற்பியல் இயந்திரமாக இருக்கலாம். ஒவ்வொரு Node-உம் கட்டுப்பாட்டு தளத்தால் (Control Plane) நிர்வகிக்கப்படுகிறது மற்றும் Pods இயக்குவதற்குத் தேவையான சேவைகளை கொண்டுள்ளது.

பொதுவாக ஒரு கொத்தில் (Cluster) பல Nodes இருக்கும்; கற்றல் அல்லது வளம் குறைந்த சூழலில், உங்களிடம் ஒரே ஒரு Node மட்டுமே இருக்கலாம்.

ஒரு Node-இல் உள்ள கூறுகளில் kubelet, ஒரு கொள்கலன் இயக்க நேரம் (container runtime), மற்றும் kube-proxy ஆகியவை அடங்கும்.

<!-- body -->
## நிர்வாகம் (Management)

API server-இல் Nodes சேர்க்க இரண்டு முக்கிய வழிகள் உள்ளன:
1. ஒரு Node-இல் உள்ள kubelet கட்டுப்பாட்டு தளத்தில் (Control Plane) தன்னை தன்-பதிவு (self-register) செய்துகொள்ளும்
2. நீங்கள் (அல்லது மற்றொரு மனித பயனர்) கைமுறையாக ஒரு Node பொருளை சேர்க்கலாம்

நீங்கள் ஒரு Node பொருளை உருவாக்கிய பின்னர், அல்லது ஒரு Node-இல் உள்ள kubelet தன்னை தன்-பதிவு செய்துகொண்ட பின்னர், கட்டுப்பாட்டு தளம் (Control Plane) புதிய Node பொருள் செல்லுபடியாகிறதா என்று சரிபார்க்கும். Kubernetes உள்நாட்டில் ஒரு Node பொருளை உருவாக்குகிறது. Kubernetes ஒரு kubelet API server-இல் பதிவு செய்யப்பட்டிருக்கிறதா என்று சரிபார்க்கிறது, அது Node-இன் `metadata.name` புலத்துடன் பொருந்த வேண்டும். Node ஆரோக்கியமாக இருந்தால், அது Pod இயக்கத் தகுதியானதாகும். இல்லையெனில், அந்த Node ஆரோக்கியமாகும் வரை எந்த கொத்து (Cluster) செயல்பாட்டிலும் புறக்கணிக்கப்படும்.

{{< note >}}
Kubernetes செல்லுபடியாகாத Node-இன் பொருளை வைத்திருந்து, அது ஆரோக்கியமாகிறதா என்று தொடர்ந்து சரிபார்க்கும். அந்த ஆரோக்கிய சரிபார்ப்பை நிறுத்த நீங்கள், அல்லது ஒரு கட்டுப்படுத்தி (controller), Node பொருளை வெளிப்படையாக நீக்க வேண்டும்.
{{< /note >}}

### Node பெயர் தனித்துவம் (Node name uniqueness)
பெயர் ஒரு Node-ஐ அடையாளம் காட்டுகிறது. இரண்டு Nodes ஒரே நேரத்தில் ஒரே பெயரைக் கொண்டிருக்க முடியாது.

### Nodes-இன் தன்-பதிவு (Self-registration of Nodes)
kubelet கொடி (flag) `--register-node` உண்மை (true) ஆக இருக்கும் போது (இயல்புநிலை), kubelet API server-இல் தன்னை பதிவு செய்துகொள்ள முயற்சிக்கும்.

### கைமுறை Node நிர்வாகம் (Manual Node administration)
kubectl பயன்படுத்தி Node பொருட்களை உருவாக்கலாம் மற்றும் மாற்றலாம். Node பொருட்களை கைமுறையாக உருவாக்க விரும்பும் போது, kubelet கொடியை (flag) `--register-node=false` என அமைக்கவும்.

## Node நிலை (Node status)
ஒரு Node-இன் நிலையில் இவை அடங்கும்: Addresses, Conditions, Capacity மற்றும் Allocatable, Info.

Node-இன் நிலையை பார்க்க kubectl பயன்படுத்தலாம்:
```shell
kubectl describe node <insert-node-name-here>
```

## Node இதயத்துடிப்பு (Node heartbeats)
இதயத்துடிப்புகள் (Heartbeats) உங்கள் கொத்து (Cluster) ஒவ்வொரு Node-இன் கிடைக்கும் தன்மையை தீர்மானிக்க உதவுகின்றன. இரண்டு வடிவங்கள் உள்ளன: ஒரு Node-இன் `.status`-க்கான புதுப்பிப்புகள், மற்றும் `kube-node-lease` namespace-க்குள் இருக்கும் Lease பொருட்கள்.

## Node கட்டுப்படுத்தி (Node controller)
Node கட்டுப்படுத்தி (Node controller) என்பது nodes-இன் பல்வேறு அம்சங்களை நிர்வகிக்கும் ஒரு Kubernetes கட்டுப்பாட்டு தள (Control Plane) கூறாகும். இதற்கு பல பங்குகள் உள்ளன: CIDR தொகுதிகளை ஒதுக்குதல், cloud provider-உடன் Node பட்டியலை புதுப்பித்துக் கொண்டிருத்தல், Nodes-இன் ஆரோக்கியத்தை கண்காணித்தல்.

### வெளியேற்றத்தில் விகித வரம்புகள் (Rate limits on eviction)
Node கட்டுப்படுத்தி வெளியேற்றல் (eviction) விகிதத்தை வினாடிக்கு `--node-eviction-rate` (இயல்புநிலை 0.1) என்று கட்டுப்படுத்துகிறது. கிடைக்கும் மண்டலத்தில் (availability zone) உள்ள Nodes ஆரோக்கியமற்றதாக மாறும் போது நடத்தை மாறுகிறது.

## வள கொள்ளளவு கண்காணிப்பு (Resource capacity tracking)
Node பொருட்கள் Node-இன் வள கொள்ளளவு (resource capacity) பற்றிய தகவல்களை கண்காணிக்கின்றன. Kubernetes திட்டமிடுபவர் (Scheduler) ஒரு Node-இல் உள்ள அனைத்து Pods-க்கும் போதுமான வளங்கள் இருப்பதை உறுதி செய்கிறது.

## Node இடவியல் (Node topology)
`TopologyManager` feature gate செயல்படுத்தப்பட்டிருந்தால், kubelet வள ஒதுக்கீடு (resource assignment) முடிவுகளை எடுக்கும் போது topology hints பயன்படுத்தலாம்.

## அடுத்து என்ன (whatsnext)
இவை பற்றி மேலும் அறியுங்கள்: ஒரு Node-ஐ உருவாக்கும் கூறுகள் (Components that make up a node), Node-க்கான API வரையறை (API definition for Node), Taints மற்றும் Tolerations, Node Resource Managers.
