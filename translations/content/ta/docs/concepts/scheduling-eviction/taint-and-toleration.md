---
reviewers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Taints மற்றும் Tolerations
content_type: concept
weight: 50
---

<!-- overview -->

[_Node affinity_](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
என்பது {{< glossary_tooltip text="Pods" term_id="pod" >}}-களின் ஒரு பண்பு — அவை குறிப்பிட்ட
{{< glossary_tooltip text="nodes" term_id="node" >}}-களை *ஈர்க்கின்றன*. _Taints_ என்பது
இதற்கு எதிரானது — ஒரு Node, குறிப்பிட்ட Pods-களை விலக்கிக்கொள்ள அனுமதிக்கிறது.

_Tolerations_ என்பவை Pods-களில் பயன்படுத்தப்படுகின்றன. Tolerations, பொருந்தும் taints உள்ள
Nodes-களில் Pods-களை திட்டமிட (schedule) scheduler-க்கு அனுமதி வழங்குகின்றன. ஆனால்
திட்டமிடல் உத்தரவாதப்படுத்தப்படவில்லை — scheduler
[மற்ற அளவுருக்களையும்](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
கணக்கில் எடுத்துக்கொள்கிறது.

Taints மற்றும் tolerations இணைந்து செயல்பட்டு, Pods-கள் தகுதியற்ற Nodes-களில்
திட்டமிடப்படாமல் உறுதிசெய்கின்றன.

<!-- body -->

## கருத்துகள் (Concepts)

[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint) கட்டளையைப் பயன்படுத்தி
ஒரு Node-க்கு taint சேர்க்கலாம். உதாரணமாக:

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

இக்கட்டளை `node1`-ல் ஒரு taint சேர்க்கிறது: key `key1`, value `value1`, effect `NoSchedule`.
இதன் பொருள் — பொருந்தும் toleration இல்லாத எந்த Pod-உம் `node1`-ல் திட்டமிடப்படாது.

taint-ஐ அகற்ற:

```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

Pod-இன் PodSpec-ல் toleration குறிப்பிடலாம். கீழ்காணும் இரண்டு tolerations-உம்
மேலே உருவாக்கப்பட்ட taint-உடன் பொருந்தும்:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key1"
  operator: "Exists"
  effect: "NoSchedule"
```

`operator`-இன் இயல்பு மதிப்பு `Equal`.

ஒரு toleration, taint-உடன் பொருந்தும் நிலைகள்:

* `operator` என்பது `Exists` ஆக இருந்தால் (`value` தேவையில்லை), அல்லது
* `operator` என்பது `Equal` ஆக இருந்து values சமம் ஆக இருந்தால்.

{{< note >}}
சிறப்பு நிகழ்வுகள்:

`key` காலியாக இருந்தால், `operator` கட்டாயம் `Exists` ஆக இருக்க வேண்டும் —
இது அனைத்து keys மற்றும் values-உடன் பொருந்தும். `effect` இன்னும் பொருந்த வேண்டும்.

காலியான `effect`, `key1` உடைய அனைத்து effects-உடனும் பொருந்தும்.
{{< /note >}}

### Effects

`effect` புலத்திற்கு அனுமதிக்கப்பட்ட மதிப்புகள்:

`NoExecute`
: Node-ல் ஏற்கனவே இயங்கும் Pods-களை பாதிக்கிறது:
  * taint-ஐ பொறுத்துக்கொள்ளாத Pods உடனடியாக வெளியேற்றப்படும்.
  * `tolerationSeconds` குறிப்பிடாமல் taint-ஐ பொறுத்துக்கொள்ளும் Pods நிரந்தரமாக இணைந்திருக்கும்.
  * `tolerationSeconds` குறிப்பிட்டு பொறுத்துக்கொள்ளும் Pods அந்த நேரம் வரை இணைந்திருக்கும்;
    அதற்குப் பிறகு Node lifecycle controller அவற்றை வெளியேற்றும்.

`NoSchedule`
: பொருந்தும் toleration இல்லாத புதிய Pods, tainted Node-ல் திட்டமிடப்படாது.
  தற்போது இயங்கும் Pods வெளியேற்றப்படாது.

`PreferNoSchedule`
: `NoSchedule`-இன் "மென்மையான" பதிப்பு. கட்டுப்பாட்டு தளம் (Control Plane)
  taint-ஐ பொறுத்துக்கொள்ளாத Pod-ஐ அந்த Node-ல் வைக்காமல் முயலும், ஆனால் உத்தரவாதமில்லை.

ஒரே Node-ல் பல taints-உம், ஒரே Pod-ல் பல tolerations-உம் வைக்கலாம். Kubernetes
இவற்றை வடிகட்டியாகப் (filter) பயன்படுத்துகிறது: Pod-இன் பொருந்தும் tolerations கழிக்கப்பட்டு,
மீதமுள்ள taints தங்கள் விளைவுகளை செலுத்துகின்றன.

உதாரணம்:

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

Pod-ல் இரண்டு tolerations மட்டுமே:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

இந்த Pod மூன்றாவது taint-க்கு toleration இல்லாததால் Node-ல் திட்டமிடப்பட மாட்டாது.
ஆனால் taint சேர்க்கும் முன்னரே இயங்கிக்கொண்டிருந்தால், தொடர்ந்து இயங்கும்.

### tolerationSeconds

`NoExecute` taint சேர்க்கப்பட்டால், பொருத்தமற்ற Pods உடனடியாக வெளியேற்றப்படும்.
`tolerationSeconds` குறிப்பிட்டால், அந்த நேரம் வரை Pod இணைந்திருக்கும்:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

இங்கு Pod 3600 வினாடிகள் Node-ல் இணைந்திருந்து பின் வெளியேற்றப்படும்.
அந்த நேரத்திற்கு முன்னர் taint நீக்கப்பட்டால் Pod வெளியேற்றப்படாது.

## பயன்பாட்டு நிகழ்வுகள் (Example Use Cases)

Taints மற்றும் tolerations, Pods-களை தகுதியற்ற Nodes-களிலிருந்து விலக்கும் நெகிழ்வான வழிமுறை.

* **Dedicated Nodes**: குறிப்பிட்ட பயனர் குழுவிற்காக மட்டும் Nodes ஒதுக்க, அந்த Nodes-களில்
  taint சேர்க்கவும் (`kubectl taint nodes nodename dedicated=groupName:NoSchedule`),
  அந்த பயனர்களின் Pods-களில் toleration சேர்க்கவும். தனிப்படுத்தல் கட்டாயமாக்க,
  Node-ல் label சேர்த்து node affinity கட்டமைக்கவும்.

* **சிறப்பு வன்பொருள் (Special Hardware)**: GPU போன்ற சிறப்பு வன்பொருள் கொண்ட Nodes-களில்
  தேவையற்ற Pods வராமல் தடுக்க taint பயன்படுத்தவும்
  (`kubectl taint nodes nodename special=true:NoSchedule`). சிறப்பு வன்பொருளை
  கோரும் Pods-களில் toleration சேர்க்கவும். [Extended Resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  மற்றும் [ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
  admission controller பயன்படுத்துவது சிறந்தது.

* **Taint based Evictions**: Node-ல் பிரச்சனை இருக்கும்போது Pod-வாரியாக வெளியேற்றல்
  நடத்துவதற்கான வழிமுறை — அடுத்த பிரிவில் விளக்கப்பட்டுள்ளது.

## Taint அடிப்படையிலான வெளியேற்றல் (Taint Based Evictions)

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Node controller, சில நிலைகளில் தானாகவே Node-க்கு taint சேர்க்கும். உள்ளமைக்கப்பட்ட taints:

* `node.kubernetes.io/not-ready`: Node தயாரில்லை (`Ready` condition `False`).
* `node.kubernetes.io/unreachable`: Node controller-ஆல் Node அடைய முடியவில்லை (`Ready` condition `Unknown`).
* `node.kubernetes.io/memory-pressure`: Node-ல் நினைவக அழுத்தம்.
* `node.kubernetes.io/disk-pressure`: Node-ல் வட்டு அழுத்தம்.
* `node.kubernetes.io/pid-pressure`: Node-ல் PID அழுத்தம்.
* `node.kubernetes.io/network-unavailable`: Node-இன் வலைப்பின்னல் கிடைக்கவில்லை.
* `node.kubernetes.io/unschedulable`: Node திட்டமிடல் செய்ய முடியாதது.
* `node.cloudprovider.kubernetes.io/uninitialized`: வெளிப்புற cloud provider-உடன்
  kubelet தொடங்கப்படும்போது இந்த taint சேர்க்கப்படும்; cloud-controller-manager துவக்கிய பிறகு
  kubelet இதை நீக்கும்.

{{< note >}}
கட்டுப்பாட்டு தளம் (Control Plane), புதிய taints சேர்க்கும் வேகத்தை கட்டுப்படுத்துகிறது.
இது பல Nodes ஒரேசமயம் அடைய முடியாமல் போகும்போது ஏற்படும் வெளியேற்றல்களை நிர்வகிக்கிறது.
{{< /note >}}

தோல்வியடையும் அல்லது துலங்காத Node-ல் Pod எவ்வளவு நேரம் இணைந்திருக்க வேண்டும் என்று
`tolerationSeconds` குறிப்பிடலாம். உதாரணமாக, network partition நிகழ்வில் நிறைய
local state கொண்ட ஒரு application-ஐ நீண்ட நேரம் Node-ல் வைத்திருக்க:

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
Kubernetes தானாகவே `node.kubernetes.io/not-ready` மற்றும்
`node.kubernetes.io/unreachable`-க்கு `tolerationSeconds=300` சேர்க்கிறது,
நீங்கள் அல்லது ஒரு controller வெளிப்படையாக குறிப்பிடாவிட்டால்.
இதன் பொருள் — இந்தப் பிரச்சனைகள் கண்டறியப்பட்டு 5 நிமிடங்கள் வரை Pods Node-ல் இணைந்திருக்கும்.
{{< /note >}}

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) Pods, கீழ்காணும் taints-க்கு
`tolerationSeconds` இல்லாமல் `NoExecute` tolerations-உடன் உருவாக்கப்படும்:

* `node.kubernetes.io/unreachable`
* `node.kubernetes.io/not-ready`

இது DaemonSet Pods இந்தப் பிரச்சனைகள் காரணமாக வெளியேற்றப்படாமல் உறுதிசெய்கிறது.

{{< note >}}
1.29-க்கு பிறகு, taint அடிப்படையிலான வெளியேற்றல் செயலாக்கம் `taint-eviction-controller`
என்ற தனி கூறாக மாற்றப்பட்டது. `--controllers=-taint-eviction-controller` அமைத்து
kube-controller-manager-ல் இதை விரும்பினால் முடக்கலாம்.
{{< /note >}}

## நிலை அடிப்படையில் Node-க்கு Taint (Taint Nodes by Condition)

கட்டுப்பாட்டு தளம், Node {{<glossary_tooltip text="controller" term_id="controller">}}-ஐ
பயன்படுத்தி [node conditions](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions)-க்கு
`NoSchedule` effect-உடன் தானாகவே taints உருவாக்குகிறது.

Scheduler, திட்டமிடல் முடிவுகளை எடுக்கும்போது node conditions-ஐ அல்ல,
taints-ஐ சரிபார்க்கிறது. இது node conditions நேரடியாக திட்டமிடலை பாதிக்காமல்
உறுதிசெய்கிறது. உதாரணமாக, `DiskPressure` condition செயலில் இருந்தால்,
கட்டுப்பாட்டு தளம் `node.kubernetes.io/disk-pressure` taint சேர்த்து
பாதிக்கப்பட்ட Node-ல் புதிய Pods திட்டமிடுவதை நிறுத்துகிறது.

புதிதாக உருவாக்கப்படும் Pods-களுக்கு node conditions புறக்கணிக்க,
தொடர்பான toleration சேர்க்கலாம். `BestEffort` தவிர வேறு
{{< glossary_tooltip text="QoS class" term_id="qos-class" >}} கொண்ட Pods-களுக்கு
கட்டுப்பாட்டு தளம் தானாகவே `node.kubernetes.io/memory-pressure` toleration சேர்க்கிறது.

DaemonSet controller, தானாகவே கீழ்காணும் `NoSchedule` tolerations அனைத்து
daemons-க்கும் சேர்க்கும்:

* `node.kubernetes.io/memory-pressure`
* `node.kubernetes.io/disk-pressure`
* `node.kubernetes.io/pid-pressure` (1.14 அல்லது அதற்குப் பிறகு)
* `node.kubernetes.io/unschedulable` (1.10 அல்லது அதற்குப் பிறகு)
* `node.kubernetes.io/network-unavailable` (host network மட்டும்)

இந்த tolerations சேர்ப்பது பின்னோக்கிய இணக்கத்தை உறுதிசெய்கிறது.
DaemonSets-க்கு கூடுதல் tolerations சேர்க்கலாம்.

## {{% heading "whatsnext" %}}

* [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/) பற்றி படிக்கவும்
* [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/) பற்றி படிக்கவும்
* [device taints and tolerations](/docs/concepts/scheduling-eviction/dynamic-resource-allocation#device-taints-and-tolerations) பற்றி படிக்கவும்
