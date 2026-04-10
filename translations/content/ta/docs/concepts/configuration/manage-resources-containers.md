---
title: Pod மற்றும் கொள்கலன்களுக்கான வளர்வு மேலாண்மை
content_type: concept
weight: 40
feature:
  title: Automatic bin packing
  description: >
    கொள்கலன்களின் வளர்வு தேவைகள் மற்றும் பிற கட்டுப்பாடுகளின் அடிப்படையில் தானாகவே இடம் ஒதுக்கும்,
    கிடைக்கும் தன்மையை பலிகொடுக்காமல். முக்கியமான மற்றும் சிறந்த-முயற்சி பணிச்சுமைகளை கலந்து
    பயன்பாட்டை அதிகரித்து மேலும் வளர்வுகளை சேமிக்கும்.
---

<!-- overview -->

ஒரு {{< glossary_tooltip term_id="pod" >}}-ஐ குறிப்பிடும்போது, ஒவ்வொரு
{{< glossary_tooltip text="கொள்கலன்" term_id="container" >}}-க்கும் எவ்வளவு வளர்வு தேவை என்பதை
விரும்பினால் குறிப்பிடலாம். மிகவும் பொதுவான வளர்வுகள் CPU மற்றும் நினைவகம் (RAM); மற்றவையும் உள்ளன.

Pod-ல் உள்ள கொள்கலன்களுக்கான வளர்வு _request_-ஐ குறிப்பிடும்போது,
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} இந்த தகவலை
எந்த node-ல் Pod-ஐ வைக்கவேண்டும் என்று தீர்மானிக்க பயன்படுத்துகிறது.
ஒரு கொள்கலனுக்கு வளர்வு _limit_ குறிப்பிடும்போது, {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
அந்த வரம்புகளை நடைமுறைப்படுத்துகிறது — இயங்கும் கொள்கலன் நீங்கள் அமைத்த வரம்பை விட அதிக வளர்வை
பயன்படுத்த அனுமதிக்கப்படாது. kubelet அந்த கொள்கலனுக்காக குறைந்தது _request_ அளவு
வளர்வையும் ஒதுக்கி வைக்கிறது.

<!-- body -->

## Requests மற்றும் limits

ஒரு Pod இயங்கும் node-ல் போதுமான வளர்வு இருந்தால், ஒரு கொள்கலன் அதன் `request`-ஐ விட
அதிக வளர்வை பயன்படுத்த முடியும் (மற்றும் அனுமதிக்கப்படும்).

எடுத்துக்காட்டாக, ஒரு கொள்கலனுக்கு 256 MiB `memory` request அமைத்து, அந்த கொள்கலன்
8GiB நினைவகமுள்ள ஒரு Node-ல் திட்டமிடப்பட்டிருந்தால் மற்றும் வேறு Pods இல்லாவிட்டால்,
அந்த கொள்கலன் அதிக RAM பயன்படுத்த முயற்சிக்கலாம்.

Limits வேறுவிதமாக செயல்படுகின்றன. `cpu` மற்றும் `memory` limits இரண்டும் kubelet மற்றும்
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}-ஆல் பயன்படுத்தப்பட்டு,
இறுதியில் kernel-ஆல் நடைமுறைப்படுத்தப்படுகின்றன. Linux node-களில், Linux kernel
{{< glossary_tooltip text="cgroups" term_id="cgroup" >}}-மூலம் limits நடைமுறைப்படுத்துகிறது.

`cpu` limits CPU throttling மூலம் நடைமுறைப்படுத்தப்படுகின்றன. ஒரு கொள்கலன் அதன் `cpu` limit-ஐ
நெருங்கும்போது, kernel அந்த கொள்கலனின் CPU அணுகலை கட்டுப்படுத்தும். எனவே `cpu` limit என்பது
kernel நடைமுறைப்படுத்தும் ஒரு கடின வரம்பு.

`memory` limits kernel-ஆல் out of memory (OOM) kills மூலம் நடைமுறைப்படுத்தப்படுகின்றன.
ஒரு கொள்கலன் அதன் `memory` limit-ஐ விட அதிகமாக பயன்படுத்தும்போது, kernel அதை நிறுத்தலாம்.
இருப்பினும், kernel நினைவக அழுத்தத்தை கண்டறிந்தால் மட்டுமே நிறுத்தல் நடக்கும். எனவே
`memory` limits எதிர்வினை முறையில் நடைமுறைப்படுத்தப்படுகின்றன.

{{< note >}}
ஒரு வளர்வுக்கு limit குறிப்பிட்டு request குறிப்பிடவில்லை என்றால், Kubernetes நீங்கள்
குறிப்பிட்ட limit-ஐ request மதிப்பாகவும் பயன்படுத்தும்.
{{< /note >}}

## வளர்வு வகைகள்

*CPU* மற்றும் *memory* ஒவ்வொன்றும் ஒரு *resource type*. CPU என்பது கணக்கீடு செயலாக்கத்தை
குறிக்கிறது, [Kubernetes CPUs](#meaning-of-cpu) அலகுகளில் குறிப்பிடப்படுகிறது.
Memory பைட்டுகளில் குறிப்பிடப்படுகிறது. Linux பணிச்சுமைகளுக்கு _huge page_ வளர்வுகளையும்
குறிப்பிடலாம்.

{{< note >}}
`hugepages-*` வளர்வுகளை overcommit செய்ய முடியாது. இது `memory` மற்றும் `cpu` வளர்வுகளிலிருந்து
வேறுபட்டது.
{{< /note >}}

CPU மற்றும் memory ஒருங்கே *compute resources* அல்லது *resources* என குறிப்பிடப்படுகின்றன.
இவை அளவிடக்கூடியவை, கோரப்பட்டு ஒதுக்கப்பட்டு பயன்படுத்தப்படலாம்.

## Pod மற்றும் கொள்கலன்களின் resource requests மற்றும் limits

ஒவ்வொரு கொள்கலனுக்கும் resource limits மற்றும் requests குறிப்பிடலாம்:

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

தனிப்பட்ட கொள்கலன்களுக்கு மட்டுமே requests மற்றும் limits குறிப்பிட முடிந்தாலும்,
ஒரு Pod-ன் ஒட்டுமொத்த resource requests மற்றும் limits பற்றி யோசிப்பதும் பயனுள்ளது.
ஒரு குறிப்பிட்ட வளர்வுக்கு, *Pod resource request/limit* என்பது Pod-ல் உள்ள
ஒவ்வொரு கொள்கலனின் resource requests/limits-ன் கூட்டுத்தொகை.

## Pod-நிலை resource specification

{{< feature-state feature_gate_name="PodLevelResources" >}}

உங்கள் கொத்தில் `PodLevelResources`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) இயக்கப்பட்டிருந்தால்,
Pod நிலையில் resource requests மற்றும் limits குறிப்பிடலாம். Pod நிலையில், Kubernetes
`cpu`, `memory`, மற்றும்/அல்லது `hugepages` resource வகைகளுக்கு மட்டுமே support தருகிறது.
இந்த வசதி, Pod-க்கான ஒட்டுமொத்த resource budget அறிவிக்க உதவுகிறது — குறிப்பாக
கொள்கலன்கள் அதிகமாக இருக்கும்போது தனிப்பட்ட தேவைகளை கணிக்க கஷ்டமாக இருக்கும் சூழலில்.

## Kubernetes-ல் Resource அலகுகள்

### CPU resource அலகுகள் {#meaning-of-cpu}

CPU resources-க்கான limits மற்றும் requests *cpu* அலகுகளில் அளவிடப்படுகின்றன.
Kubernetes-ல், 1 CPU அலகு என்பது **1 physical CPU core** அல்லது **1 virtual core**-க்கு
சமம், node physical host-ஆ அல்லது virtual machine-ஆ என்பதைப் பொறுத்து.

பின்னல் requests அனுமதிக்கப்படுகின்றன. `0.5` CPU கோரினால், `1.0` CPU-வின் பாதி நேரம்
கோரப்படுகிறது. `0.1` என்ற [quantity](/docs/reference/kubernetes-api/common-definitions/quantity/)
வெளிப்பாடு `100m`-க்கு சமம் — "நூறு millicpu" என படிக்கப்படுகிறது.

CPU resource எப்போதும் mutlack அளவாக குறிப்பிடப்படுகிறது, ஒப்பீட்டு அளவாக அல்ல.
எடுத்துக்காட்டாக, `500m` CPU என்பது single-core, dual-core அல்லது 48-core machine-ல்
இயங்கினாலும் கிட்டத்தட்ட ஒரே அளவு கணக்கீடு சக்தியை குறிக்கிறது.

{{< note >}}
Kubernetes `1m` அல்லது `0.001` CPU-ஐ விட நுணுக்கமான CPU resources குறிப்பிட அனுமதிக்காது.
1 CPU-ஐ விட குறைவாக பயன்படுத்தும்போது, decimal வடிவத்தை விட milliCPU வடிவத்தை பயன்படுத்துவது
நல்லது.
{{< /note >}}

### Memory resource அலகுகள் {#meaning-of-memory}

`memory`-க்கான limits மற்றும் requests பைட்டுகளில் அளவிடப்படுகின்றன. Memory-ஐ plain integer
அல்லது இந்த [quantity](/docs/reference/kubernetes-api/common-definitions/quantity/) suffix-களில்
ஒன்றாக வெளிப்படுத்தலாம்: E, P, T, G, M, k. இரண்டின் அடுக்குகளான Ei, Pi, Ti, Gi, Mi, Ki-ஐயும்
பயன்படுத்தலாம். எடுத்துக்காட்டாக, கீழ்க்காணும் மதிப்புகள் கிட்டத்தட்ட சமம்:

```shell
128974848, 129e6, 129M,  128974848000m, 123Mi
```

Suffix-களின் case கவனமாக கவனிக்கவும். `400m` memory கோரினால், அது 0.4 பைட்டுகளுக்கான
கோரிக்கை — யாரோ `400Mi` (400 mebibytes) அல்லது `400M` (400 megabytes) கேட்க நினைத்திருக்கலாம்.

## கொள்கலன் resources எடுத்துக்காட்டு {#example-1}

கீழ்க்காணும் Pod-ல் இரண்டு கொள்கலன்கள் உள்ளன. இரண்டு கொள்கலன்களுக்கும் 0.25 CPU மற்றும்
64MiB (2<sup>26</sup> bytes) நினைவக request வரையறுக்கப்பட்டுள்ளது. ஒவ்வொரு கொள்கலனுக்கும்
0.5 CPU மற்றும் 128MiB நினைவக limit உள்ளது.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## Resource requests உள்ள Pods எவ்வாறு திட்டமிடப்படுகின்றன

ஒரு Pod உருவாக்கும்போது, Kubernetes scheduler Pod இயங்க ஒரு node தேர்வு செய்கிறது.
ஒவ்வொரு node-க்கும் ஒவ்வொரு resource வகையில் ஒரு அதிகபட்ச திறன் உள்ளது: அது Pods-க்கு
வழங்கக்கூடிய CPU மற்றும் நினைவகம். scheduler உறுதிப்படுத்துகிறது — ஒவ்வொரு resource வகையிலும்,
திட்டமிடப்பட்ட கொள்கலன்களின் resource requests-ன் கூட்டுத்தொகை node-ன் திறனை விட குறைவாக இருக்கும்.

node-ல் உண்மையான நினைவக அல்லது CPU பயன்பாடு மிகக் குறைவாக இருந்தாலும், திறன் சோதனை
தோல்வியடைந்தால் scheduler node-ல் Pod வைக்க மறுக்கும். இது பிற்காலத்தில் resource பயன்பாடு
அதிகரிக்கும்போது — எடுத்துக்காட்டாக, தினசரி peak-ல் — ஒரு node-ல் resource பற்றாக்குறை
ஏற்படாமல் பாதுகாக்கிறது.

## Kubernetes resource requests மற்றும் limits எவ்வாறு பயன்படுத்துகிறது {#how-pods-with-resource-limits-are-run}

kubelet ஒரு Pod-ன் ஒரு பகுதியாக ஒரு கொள்கலனை தொடங்கும்போது, அந்த கொள்கலனின்
நினைவகம் மற்றும் CPU-க்கான requests மற்றும் limits-ஐ container runtime-க்கு அனுப்புகிறது.

Linux-ல், container runtime பொதுவாக நீங்கள் வரையறுத்த limits-ஐ பயன்படுத்தி நடைமுறைப்படுத்த
kernel {{< glossary_tooltip text="cgroups" term_id="cgroup" >}} configure செய்கிறது.

- **CPU limit**: ஒரு கொள்கலன் பயன்படுத்தக்கூடிய CPU நேரத்தின் கடின உச்சவரம்பு. ஒவ்வொரு
  scheduling interval-லும் (time slice), Linux kernel இந்த வரம்பு மீறப்படுகிறதா என சோதிக்கும்;
  மீறப்பட்டால், kernel அந்த cgroup-ஐ மீண்டும் இயக்க அனுமதிப்பதற்கு முன் காத்திருக்கும்.
- **CPU request**: பொதுவாக ஒரு weighting வரையறுக்கிறது. பல கொள்கலன்கள் போட்டியிடும்
  system-ல், அதிக CPU requests உள்ள பணிச்சுமைகளுக்கு அதிக CPU நேரம் ஒதுக்கப்படும்.
- **Memory request**: முக்கியமாக Kubernetes Pod திட்டமிடலில் பயன்படுகிறது. cgroups v2
  பயன்படுத்தும் node-ல், container runtime memory request-ஐ `memory.min` மற்றும்
  `memory.low` அமைக்க hint-ஆக பயன்படுத்தலாம்.
- **Memory limit**: அந்த cgroup-க்கான நினைவக வரம்பு வரையறுக்கிறது. கொள்கலன் இந்த வரம்பை
  விட அதிக நினைவகம் ஒதுக்க முயற்சித்தால், Linux kernel out-of-memory subsystem செயல்படும்
  மற்றும் பொதுவாக நினைவகம் ஒதுக்க முயற்சித்த கொள்கலனில் ஒரு process-ஐ நிறுத்தும்.

ஒரு கொள்கலன் அதன் memory request-ஐ விட அதிகமாக பயன்படுத்தி, அது இயங்கும் node-ல்
ஒட்டுமொத்த நினைவகம் குறைவாகி விட்டால், அந்த கொள்கலன் சேர்ந்த Pod
{{< glossary_tooltip text="evicted" term_id="eviction" >}} செய்யப்படலாம்.

ஒரு கொள்கலன் நீண்ட காலத்திற்கு அதன் CPU limit-ஐ மீறலாம் அல்லது மீறாமல் இருக்கலாம்.
இருப்பினும், container runtimes அதிகப்படியான CPU பயன்பாட்டிற்காக Pods அல்லது கொள்கலன்களை
நிறுத்துவதில்லை.

### கொள்கலன் resources மறு அளவிடல்

ஒரு Pod உருவாக்கிய பிறகு, உண்மையான பயன்பாட்டு முறைகளின் அடிப்படையில் அதன் CPU அல்லது
நினைவக resources சரிசெய்ய வேண்டியிருக்கலாம். Kubernetes Pod resources மறு அளவிடுவதற்கு
இரண்டு அணுகுமுறைகளை வழங்குகிறது:

#### In-place resize {#pod-resize-inplace}
{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

இயங்கும் Pod-ஐ மீண்டும் உருவாக்காமல் கொள்கலன்களின் CPU மற்றும் memory `requests` மற்றும்
`limits`-ஐ மாற்றலாம். இதை _in-place Pod vertical scaling_ அல்லது _in-place Pod resize_ என்கிறோம்.

#### மாற்று Pods தொடங்கி மறு அளவிடல்

ஒரு Pod-ன் resources மாற்றுவதற்கான cloud native அணுகுமுறை, workload object-ல் (Deployment அல்லது
StatefulSet போன்றவை) Pod template-ஐ புதுப்பிப்பது மற்றும் workload controller புதுப்பிக்கப்பட்ட
resources உடன் புதிய Pods-ஆல் பழையவற்றை மாற்றட்டும் என்பது.

### கணக்கீட்டு மற்றும் நினைவக resource பயன்பாட்டை கண்காணித்தல்

kubelet Pod-ன் resource பயன்பாட்டை Pod [`status`](/docs/concepts/overview/working-with-objects/#object-spec-and-status)-ன்
ஒரு பகுதியாக தெரிவிக்கிறது. கொத்தில் விருப்பமான
[கண்காணிப்பு கருவிகள்](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) இருந்தால்,
Pod resource பயன்பாட்டை [Metrics API](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-api)
மூலம் நேரடியாக அல்லது கண்காணிப்பு கருவிகளிலிருந்து பெறலாம்.

## உள்ளூர் தற்காலிக சேமிப்பு (Local ephemeral storage)

உள்ளூர் தற்காலிக சேமிப்பு பற்றிய பொதுவான கருத்துகளுக்கும், ஒரு கொள்கலனுக்கான
ephemeral storage requests மற்றும் limits அமைக்க குறிப்புகளுக்கும்,
[local ephemeral storage](/docs/concepts/storage/ephemeral-storage/) பக்கத்தை பாருங்கள்.

### உள்ளூர் தற்காலிக சேமிப்பு கண்காணிப்பு

local ephemeral storage capacity isolation இயக்கியிருந்தால், kubelet எவ்வளவு
local ephemeral storage பயன்படுத்தப்படுகிறது என்பதை அளவிடலாம்.

Kubernetes ஒரு Pod பயன்படுத்தும் ephemeral storage-ஐ இவற்றிலிருந்து கண்காணிக்கிறது:
* கொள்கலனின் writable layer (rootfs), container images, அல்லது இரண்டிலும் எழுதுவது.
* உள்ளூர் `emptyDir` volumes-ல் எழுதுவது.
* Pod-ன் சொந்த logs (பொதுவாக `/var/log/pods`-ல் சேமிக்கப்படும்).
* Kubernetes Pod-ல் map செய்யும் system files, `/etc/hosts` போன்றவை.

## விரிவிக்கப்பட்ட வளர்வுகள் (Extended resources)

Extended resources என்பவை `kubernetes.io` domain-க்கு வெளியே உள்ள முழுத்தகுதி resource
பெயர்கள். கொத்து operators Kubernetes-ல் உள்ளமைக்கப்படாத resources-ஐ advertise செய்யவும்
பயனர்கள் Pods-ல் அவற்றை கோரவும் இவை அனுமதிக்கின்றன.

Extended Resources பயன்படுத்த இரண்டு படிகள் தேவை: முதலில் கொத்து operator ஒரு Extended
Resource-ஐ advertise செய்ய வேண்டும்; இரண்டாவதாக, பயனர்கள் Pods-ல் Extended Resource-ஐ
கோர வேண்டும்.

### Extended resources நிர்வகிப்பு

#### Node-நிலை extended resources

Node-நிலை extended resources nodes-உடன் இணைக்கப்பட்டுள்ளன.

##### Device plugin மேலாண்மை resources
ஒவ்வொரு node-லும் device plugin மேலாண்மை resources-ஐ advertise செய்வது பற்றி
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) பார்க்கவும்.

##### மற்ற resources

புதிய node-நிலை extended resource advertise செய்ய, கொத்து operator API server-க்கு
`PATCH` HTTP request அனுப்பி node-ன் `status.capacity`-ல் கிடைக்கும் அளவை குறிப்பிடலாம்.

**எடுத்துக்காட்டு:**

`k8s-master` master உள்ள `k8s-node-1` node-ல் ஐந்து "example.com/foo" resources advertise
செய்ய `curl` பயன்படுத்தி HTTP request உருவாக்குவது எப்படி என்பதை காட்டும் எடுத்துக்காட்டு:

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
மேற்கூறிய request-ல், `~1` என்பது patch path-ல் `/` எழுத்துக்கான encoding.
JSON-Patch-ல் operation path மதிப்பு JSON-Pointer ஆக விளக்கப்படுகிறது.
{{< /note >}}

#### Cluster-நிலை extended resources

Cluster-நிலை extended resources nodes-உடன் இணைக்கப்படவில்லை. இவை பொதுவாக scheduler
extenders-ஆல் நிர்வகிக்கப்படுகின்றன.

### Extended resources பயன்படுத்துவது

பயனர்கள் CPU மற்றும் நினைவகம் போல Pod specs-ல் extended resources பயன்படுத்தலாம்.
scheduler resource accounting கவனிக்கும் — கிடைக்கும் அளவை விட அதிகமான resources
ஒரே நேரத்தில் Pods-க்கு ஒதுக்கப்படாது.

API server extended resources அளவுகளை முழு எண்களாக மட்டுமே ஏற்கும். _சரியான_ அளவுகளின்
எடுத்துக்காட்டுகள்: `3`, `3000m`, `3Ki`. _தவறான_ அளவுகள்: `0.5`, `1500m`.

{{< note >}}
Extended resources request மற்றும் limit சமாக இருக்க வேண்டும் — overcommit செய்ய முடியாது.
{{< /note >}}

CPU, நினைவகம் மற்றும் எந்த extended resources-ஐயும் உள்ளிட்ட அனைத்து resource requests
நிறைவேறினால் மட்டுமே Pod திட்டமிடப்படும். resource request நிறைவேற்றப்படாத வரை Pod `PENDING`
நிலையில் இருக்கும்.

**எடுத்துக்காட்டு:**

கீழ்க்காணும் Pod 2 CPUs மற்றும் 1 "example.com/foo" (extended resource) கோருகிறது:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```

## PID கட்டுப்படுத்துதல் (PID limiting)

Process ID (PID) limits, kubelet-ஐ ஒரு Pod பயன்படுத்தக்கூடிய PIDs எண்ணிக்கையை கட்டுப்படுத்த
configure செய்ய அனுமதிக்கின்றன. தகவலுக்கு
[PID Limiting](/docs/concepts/policy/pid-limiting/) பார்க்கவும்.

## பிழை நீக்கம் (Troubleshooting)

### என் Pods `FailedScheduling` event message உடன் pending-ஆக உள்ளன

scheduler ஒரு Pod பொருந்தும் எந்த node-ஐயும் கண்டுபிடிக்க முடியாவிட்டால், Pod இடம் கிடைக்கும்
வரை திட்டமிடப்படாமல் இருக்கும். scheduler ஒரு Pod-க்கு இடம் கண்டுபிடிக்கத் தவறும் ஒவ்வொரு
முறையும் ஒரு Event உருவாக்கப்படும். Pod-ன் events-ஐ பார்க்க `kubectl` பயன்படுத்தலாம்:

```shell
kubectl describe pod frontend | grep -A 9999999999 Events
```

ஒரு Pod pending ஆக இருந்து இந்த வகையான message வந்தால் முயற்சிக்க வேண்டியவை:

- கொத்தில் அதிக nodes சேர்க்கவும்.
- pending Pods-க்கு இடம் உருவாக்க தேவையற்ற Pods நிறுத்தவும்.
- Pod அனைத்து nodes-ஐ விட பெரியதல்ல என்பதை சரிபார்க்கவும்.
- Node taints சரிபார்க்கவும்.

### என் கொள்கலன் நிறுத்தப்பட்டது

resource limit காரணமாக கொள்கலன் நிறுத்தப்படுகிறதா என சரிபார்க்க, `kubectl describe pod`
பயன்படுத்தவும்:

```shell
kubectl describe pod simmemleak-hra99
```

வெளியீட்டில் `OOMKilled` காரணம் தெரிந்தால், கொள்கலன் அதன் limit-ஐ விட அதிக நினைவகம்
பயன்படுத்த முயற்சித்தது. application code-ல் memory leak-ஐ சரிபார்க்கவும். தேவைப்பட்டால்,
அந்த கொள்கலனுக்கு அதிக memory limit (மற்றும் request) அமைக்கவும்.

## {{% heading "whatsnext" %}}

* [கொள்கலன்கள் மற்றும் Pods-க்கு Memory resources ஒதுக்குவது](/docs/tasks/configure-pod-container/assign-memory-resource/) பற்றி நடைமுறை அனுபவம் பெறுங்கள்.
* [கொள்கலன்கள் மற்றும் Pods-க்கு CPU resources ஒதுக்குவது](/docs/tasks/configure-pod-container/assign-cpu-resource/) பற்றி நடைமுறை அனுபவம் பெறுங்கள்.
* API reference ஒரு [container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) மற்றும் அதன் [resource requirements](/docs/reference/kubernetes-api/workload-resources/pod-v1/#resources)-ஐ எவ்வாறு வரையறுக்கிறது என்பதை படியுங்கள்.
* [local ephemeral storage](/docs/concepts/storage/ephemeral-storage/) பற்றி மேலும் படியுங்கள்.
* [Pods-க்கான Quality of Service classes](/docs/concepts/workloads/pods/pod-qos/) பற்றி மேலும் படியுங்கள்.
* [DRA மூலம் Extended Resource ஒதுக்கீடு](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource) பற்றி மேலும் படியுங்கள்.
