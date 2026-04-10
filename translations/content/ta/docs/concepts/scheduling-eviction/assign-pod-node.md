---
reviewers:
- davidopp
- dom4ha
- kevin-wangzefeng
- macsko
- sanposhiho
title: Pod-களை Node-களில் ஒதுக்கீடு செய்தல்
content_type: concept
weight: 20
---

<!-- overview -->

ஒரு {{< glossary_tooltip text="Pod" term_id="pod" >}}-ஐ குறிப்பிட்ட
{{< glossary_tooltip text="Node" term_id="node" >}}-களில் மட்டுமே இயங்கும்படி கட்டுப்படுத்தலாம்,
அல்லது குறிப்பிட்ட Node-களில் இயங்குவதை விரும்பும்படி அமைக்கலாம்.
இதற்கு பல வழிகள் உள்ளன; பரிந்துரைக்கப்பட்ட அனைத்து முறைகளும்
[முத்திரை தேர்வாளர்களை (label selectors)](/docs/concepts/overview/working-with-objects/labels/)
பயன்படுத்துகின்றன.
பெரும்பாலான சந்தர்ப்பங்களில் இந்த கட்டுப்பாடுகளை நீங்கள் நேரடியாக அமைக்க தேவையில்லை;
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} தானாகவே சிறந்த Node-ஐ தேர்வு செய்யும்.
இருப்பினும், SSD இணைக்கப்பட்ட Node தேவைப்படும் போது, அல்லது அதிக தொடர்பு வைத்திருக்கும்
இரண்டு சேவைகளை ஒரே கிடைக்கும் மண்டலத்தில் (availability zone) வைக்க வேண்டும் என்றால்,
இந்த அம்சங்கள் பயனளிக்கும்.

<!-- body -->

Pod-களை எங்கு திட்டமிடுவது என்று தேர்வு செய்ய பின்வரும் முறைகளில் ஏதேனும் ஒன்றை
பயன்படுத்தலாம்:

- [nodeSelector](#nodeselector) — [Node முத்திரைகளுக்கு (node labels)](#built-in-node-labels) எதிராக பொருத்துதல்
- [Affinity மற்றும் anti-affinity](#affinity-and-anti-affinity)
- [nodeName](#nodename) புலம்
- [Pod topology spread constraints](#pod-topology-spread-constraints)

## Node முத்திரைகள் {#built-in-node-labels}

பல Kubernetes பொருள்களைப் போலவே, Node-களுக்கும்
[முத்திரைகள் (labels)](/docs/concepts/overview/working-with-objects/labels/) உள்ளன.
நீங்கள் [கைமுறையாக முத்திரைகள் இணைக்கலாம்](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
Kubernetes ஒரு கொத்தில் (cluster) உள்ள அனைத்து Node-களிலும் [நிலையான முத்திரைகளின் தொகுப்பை](/docs/reference/node/node-labels/) தானாகவே அமைக்கும்.

{{<note>}}
இந்த முத்திரைகளின் மதிப்புகள் cloud வழங்குனரைப் பொறுத்து மாறுபடும்; நம்பகத்தன்மை உறுதி செய்யப்படவில்லை.
{{</note>}}

### Node தனிமை / கட்டுப்பாடு

Node-களுக்கு முத்திரைகள் சேர்ப்பதன் மூலம் குறிப்பிட்ட Node-களில் மட்டுமே Pod-கள் திட்டமிடப்படுமாறு
செய்யலாம். தனிமை, பாதுகாப்பு, அல்லது ஒழுங்குமுறை தேவைகளுக்கு இது பயனளிக்கும்.

Node தனிமைக்கு முத்திரைகளை பயன்படுத்தினால், {{<glossary_tooltip text="kubelet" term_id="kubelet">}}
மாற்ற இயலாத முத்திரை விசைகளைப் (label keys) பயன்படுத்துங்கள். இது சமரசம் செய்யப்பட்ட Node
தனக்கே அந்த முத்திரைகளை அமைத்துக்கொண்டு திட்டமிடலை ஏமாற்றுவதைத் தடுக்கும்.

[`NodeRestriction` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
`node-restriction.kubernetes.io/` முன்னொட்டுடன் கூடிய முத்திரைகளை kubelet அமைக்கவோ மாற்றவோ
தடுக்கிறது.

## nodeSelector

`nodeSelector` என்பது Node தேர்வுக்கான எளிமையான மற்றும் பரிந்துரைக்கப்பட்ட முறையாகும்.
Pod spec-ல் `nodeSelector` புலத்தை சேர்த்து, இலக்கு Node-ல் இருக்க வேண்டிய
[Node முத்திரைகளை](#built-in-node-labels) குறிப்பிடுங்கள்.
Kubernetes குறிப்பிட்ட அனைத்து முத்திரைகளும் உள்ள Node-களில் மட்டுமே Pod-ஐ திட்டமிடும்.

மேலும் தகவலுக்கு [Pod-களை Node-களுக்கு ஒதுக்கீடு செய்தல்](/docs/tasks/configure-pod-container/assign-pods-nodes) காண்க.

## Affinity மற்றும் anti-affinity

`nodeSelector` என்பது குறிப்பிட்ட முத்திரைகள் உள்ள Node-களுடன் Pod-களை இணைக்க எளிய வழியாகும்.
Affinity மற்றும் anti-affinity நீங்கள் வரையறுக்கக்கூடிய கட்டுப்பாடுகளின் வகைகளை விரிவாக்குகின்றன.
சில நன்மைகள்:

- Affinity/anti-affinity மொழி மிகவும் விரிவானது — `nodeSelector` எல்லா குறிப்பிட்ட முத்திரைகளும்
  உள்ள Node-களை மட்டுமே தேர்வு செய்யும்; affinity/anti-affinity தேர்வு தர்க்கத்தின் மீது
  அதிக கட்டுப்பாட்டை வழங்குகிறது.
- ஒரு விதி *மென்மையானது* அல்லது *விரும்பப்படுவது* என்று குறிப்பிடலாம், எனவே பொருந்தும்
  Node கிடைக்காவிட்டாலும் scheduler இன்னும் Pod-ஐ திட்டமிடும்.
- Node முத்திரைகளுக்கு பதிலாக, அதே Node-ல் (அல்லது இதர topology domain-ல்) இயங்கும் மற்ற
  Pod-களின் முத்திரைகளை அடிப்படையாகக் கொண்டு Pod-களை கட்டுப்படுத்தலாம்.

Affinity அம்சம் இரண்டு வகைகளை கொண்டுள்ளது:

- *Node affinity* — `nodeSelector` போல செயல்படுகிறது, ஆனால் மிகவும் விரிவானது மற்றும்
  மென்மையான விதிகளை அமைக்க அனுமதிக்கிறது.
- *Inter-pod affinity/anti-affinity* — மற்ற Pod-களின் முத்திரைகளை அடிப்படையாகக் கொண்டு
  Pod-களை கட்டுப்படுத்த அனுமதிக்கிறது.

### Node affinity

Node affinity கருத்தில் `nodeSelector`-ஐ போன்றது — Node முத்திரைகளை அடிப்படையாகக் கொண்டு
Pod எந்த Node-ல் திட்டமிடப்படலாம் என்று கட்டுப்படுத்துகிறது. இரண்டு வகைகள் உள்ளன:

- `requiredDuringSchedulingIgnoredDuringExecution`: விதி நிறைவேறாவிட்டால் scheduler
  Pod-ஐ திட்டமிட முடியாது. இது `nodeSelector`-ஐ போலவே செயல்படுகிறது, ஆனால் மிகவும் விரிவான
  தொடரமைப்புடன்.
- `preferredDuringSchedulingIgnoredDuringExecution`: scheduler விதியை நிறைவேற்றும் Node-ஐ
  கண்டறிய முயற்சிக்கும். பொருந்தும் Node கிடைக்காவிட்டால், Pod இன்னும் திட்டமிடப்படும்.

{{<note>}}
மேற்கண்ட வகைகளில் `IgnoredDuringExecution` என்பது, Kubernetes Pod-ஐ திட்டமிட்ட பிறகு
Node முத்திரைகள் மாறினாலும் Pod தொடர்ந்து இயங்கும் என்று பொருள்படும்.
{{</note>}}

Node affinity-ஐ Pod spec-ல் உள்ள `.spec.affinity.nodeAffinity` புலம் மூலம் குறிப்பிடலாம்.

`operator` புலத்தை பயன்படுத்தி Kubernetes எந்த தர்க்க ஆபரேட்டரை (logical operator) பயன்படுத்துவது
என்று குறிப்பிடலாம்: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.

[Operators](#operators) பிரிவில் இவை எவ்வாறு செயல்படுகின்றன என்று மேலும் அறியலாம்.

`NotIn` மற்றும் `DoesNotExist` Node anti-affinity நடத்தையை வரையறுக்க அனுமதிக்கின்றன.
மாற்றாக குறிப்பிட்ட Node-களிலிருந்து Pod-களை விலக்க
[Node taint-கள்](/docs/concepts/scheduling-eviction/taint-and-toleration/) பயன்படுத்தலாம்.

{{<note>}}
`nodeSelector` மற்றும் `nodeAffinity` இரண்டையும் குறிப்பிட்டால், Node-ல் Pod திட்டமிடப்படுவதற்கு
இரண்டும் நிறைவேற வேண்டும்.

`nodeSelectorTerms`-ல் பல terms குறிப்பிட்டால், அவற்றில் எதேனும் ஒன்று நிறைவேறினால் Pod
திட்டமிடப்படும் (OR).

ஒரே term-ல் `matchExpressions`-ல் பல expressions குறிப்பிட்டால், அனைத்தும் நிறைவேற வேண்டும் (AND).
{{</note>}}

#### Node affinity எடை (weight)

`preferredDuringSchedulingIgnoredDuringExecution` affinity வகையின் ஒவ்வொரு நிகழ்விற்கும்
1 முதல் 100 வரை `weight` குறிப்பிடலாம். scheduler Pod-ஐ திட்டமிடும் போது, விரும்பப்படும்
விதிகளை நிறைவேற்றும் Node-களுக்கு அந்த `weight` மதிப்புகளை கூட்டி மொத்த மதிப்பெண்ணை
கணக்கிடும். அதிக மதிப்பெண் கொண்ட Node-கள் முன்னுரிமை பெறும்.

#### திட்டமிடல் சுயவிவரத்திற்கு ஏற்ப Node affinity

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

பல [திட்டமிடல் சுயவிவரங்களை (scheduling profiles)](/docs/reference/scheduling/config/#multiple-profiles)
உருவாக்கும் போது, ஒரு சுயவிவரத்தை Node affinity-உடன் தொடர்புபடுத்தலாம். இது ஒரு சுயவிவரம்
குறிப்பிட்ட Node தொகுப்பில் மட்டுமே பொருந்தும் போது பயனளிக்கும்.

### Inter-pod affinity மற்றும் anti-affinity

Inter-pod affinity மற்றும் anti-affinity, Node முத்திரைகளுக்கு பதிலாக, அந்த Node-ல் ஏற்கனவே
இயங்கும் மற்ற Pod-களின் முத்திரைகளை அடிப்படையாகக் கொண்டு Pod-களை திட்டமிட எந்த Node-கள்
உகந்தவை என்று கட்டுப்படுத்த அனுமதிக்கின்றன.

Inter-pod affinity மற்றும் anti-affinity "இந்த Pod ஒரு X-ல் இயங்க வேண்டும் (அல்லது வேண்டாம்),
அந்த X ஏற்கனவே Y விதியை நிறைவேற்றும் ஒன்று அல்லது அதிக Pod-களை இயக்கிக்கொண்டிருந்தால்"
என்ற வடிவத்தை எடுக்கின்றன — X என்பது Node, rack, cloud zone போன்ற topology domain; Y என்பது
Kubernetes நிறைவேற்ற முயற்சிக்கும் விதி.

topology domain-ஐ (X) `topologyKey` மூலம் வெளிப்படுத்துகிறீர்கள், இது domain-ஐ குறிக்கும்
Node முத்திரை விசையாகும்.

{{< note >}}
Inter-pod affinity மற்றும் anti-affinity அதிக செயல்பாட்டு சுமையை ஏற்படுத்துவதால், பெரிய
கொத்துகளில் (cluster) திட்டமிடலை கணிசமாக மெதுவாக்கலாம். நூற்றுக்கணக்கான Node-களுக்கும்
அதிகமான கொத்துகளில் இவற்றை பயன்படுத்துவது பரிந்துரைக்கப்படவில்லை.
{{</note>}}

Node affinity-ஐ போலவே, inter-pod affinity மற்றும் anti-affinity-க்கும் இரண்டு வகைகள் உள்ளன:

- `requiredDuringSchedulingIgnoredDuringExecution`
- `preferredDuringSchedulingIgnoredDuringExecution`

Inter-pod affinity பயன்படுத்த Pod spec-ல் `affinity.podAffinity` புலத்தை பயன்படுத்துங்கள்.
Inter-pod anti-affinity-க்கு `affinity.podAntiAffinity` புலத்தை பயன்படுத்துங்கள்.

#### நடைமுறை பயன்பாட்டு எடுத்துக்காட்டுகள்

மூன்று Node கொண்ட ஒரு கொத்தில் ஒரு வலை பயன்பாடு மற்றும் ஒரு நினைவக தேக்கம் (Redis போன்றது)
இயக்குகிறீர்கள் என்று கற்பனை செய்யுங்கள். தாமதத்தை குறைக்க, வலை சேவையகங்களை தேக்கங்களுடன்
ஒரே Node-ல் வைக்க inter-pod affinity மற்றும் anti-affinity பயன்படுத்தலாம்.

Redis cache Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

Web server Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.16-alpine
```

மேற்கண்ட இரண்டு Deployment-களை உருவாக்கிய பலன்: ஒவ்வொரு வலை சேவையகமும் ஒரு தேக்கத்துடன்
ஒரே Node-ல் வைக்கப்படும், மூன்று தனித்தனி Node-களில்.

## nodeName

`nodeName` என்பது affinity அல்லது `nodeSelector`-ஐ விட நேரடியான Node தேர்வு முறையாகும்.
இது Pod spec-ல் உள்ள ஒரு புலம். `nodeName` புலம் காலியாக இல்லாவிட்டால், scheduler அந்த Pod-ஐ
புறக்கணிக்கும், மேலும் குறிப்பிடப்பட்ட Node-ல் உள்ள kubelet அந்த Node-ல் Pod-ஐ வைக்க
முயற்சிக்கும். `nodeName` பயன்படுத்துவது `nodeSelector` அல்லது affinity மற்றும் anti-affinity
விதிகளை மேலீடு செய்கிறது.

`nodeName` பயன்படுத்துவதில் சில வரம்புகள் உள்ளன:

- குறிப்பிட்ட Node இல்லாவிட்டால், Pod இயங்காது, சில சந்தர்ப்பங்களில் தானாகவே நீக்கப்படலாம்.
- Node-ல் Pod-க்கான வளங்கள் இல்லாவிட்டால், Pod தோல்வியடையும்.
- Cloud சூழலில் Node பெயர்கள் எப்போதும் நம்பகமாகவோ நிலையாகவோ இருக்காது.

{{< warning >}}
`nodeName` தனிப்பயன் scheduler-களுக்காக அல்லது அமைந்த scheduler-களை கடந்துசெல்ல வேண்டிய
மேம்பட்ட பயன்பாட்டு நிகழ்வுகளுக்காக வடிவமைக்கப்பட்டுள்ளது. Scheduler-களை கடந்துசெல்வது
ஒதுக்கப்பட்ட Node-கள் அதிக சுமை பெற்றால் Pod தோல்வியடைய வழிவகுக்கலாம். Scheduler-களை
கடந்துசெல்லாமல் Pod-ஐ குறிப்பிட்ட Node-ல் ஒதுக்க [node affinity](#node-affinity) அல்லது
[`nodeSelector` புலத்தை](#nodeselector) பயன்படுத்துங்கள்.
{{</ warning >}}

`nodeName` புலத்துடன் Pod spec எடுத்துக்காட்டு:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

மேற்கண்ட Pod `kube-01` Node-ல் மட்டுமே இயங்கும்.

## Pod topology spread constraints

கொத்தில் (cluster) Pod-கள் எவ்வாறு பரவுகின்றன என்பதை கட்டுப்படுத்த _topology spread constraints_
பயன்படுத்தலாம் — regions, zones, Node-கள், அல்லது நீங்கள் வரையறுக்கும் எந்த topology domain-களிலும்.
செயல்திறன், கிடைக்கும் தன்மை, அல்லது ஒட்டுமொத்த பயன்பாட்டை மேம்படுத்த இதை செய்யலாம்.

இவை எவ்வாறு செயல்படுகின்றன என்று மேலும் அறிய
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/) படிக்கவும்.

## Operators (ஆபரேட்டர்கள்)

`nodeAffinity` மற்றும் `podAffinity`-க்கான `operator` புலத்தில் பயன்படுத்தக்கூடிய அனைத்து
தர்க்க ஆபரேட்டர்கள்:

| ஆபரேட்டர் | நடத்தை |
| :---: | :--- |
| `In` | முத்திரை மதிப்பு வழங்கப்பட்ட சரங்களின் தொகுப்பில் உள்ளது |
| `NotIn` | முத்திரை மதிப்பு வழங்கப்பட்ட சரங்களின் தொகுப்பில் இல்லை |
| `Exists` | இந்த விசையுடன் ஒரு முத்திரை பொருளில் உள்ளது |
| `DoesNotExist` | இந்த விசையுடன் எந்த முத்திரையும் பொருளில் இல்லை |

பின்வரும் ஆபரேட்டர்கள் `nodeAffinity`-உடன் மட்டுமே பயன்படுத்தலாம்:

| ஆபரேட்டர் | நடத்தை |
| :---: | :--- |
| `Gt` | புலம் மதிப்பு முழு எண்ணாக பாகுபடுத்தப்படும்; இந்த தேர்வாளரால் பெயரிடப்பட்ட முத்திரையின் மதிப்பை விட அதிகமாக இருக்கும் |
| `Lt` | புலம் மதிப்பு முழு எண்ணாக பாகுபடுத்தப்படும்; இந்த தேர்வாளரால் பெயரிடப்பட்ட முத்திரையின் மதிப்பை விட குறைவாக இருக்கும் |

{{<note>}}
`Gt` மற்றும் `Lt` ஆபரேட்டர்கள் முழு எண் அல்லாத மதிப்புகளுடன் செயல்படாது. மேலும் இவை
`podAffinity`-க்கு கிடைக்காது.
{{</note>}}

## {{% heading "whatsnext" %}}

- [taint மற்றும் toleration](/docs/concepts/scheduling-eviction/taint-and-toleration/) பற்றி மேலும் படிக்கவும்.
- [node affinity](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md) மற்றும்
  [inter-pod affinity/anti-affinity](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md)
  வடிவமைப்பு ஆவணங்களை படிக்கவும்.
- [topology manager](/docs/tasks/administer-cluster/topology-manager/) Node அளவிலான வள ஒதுக்கீட்டு
  முடிவுகளில் எவ்வாறு பங்கேற்கிறது என்று அறியுங்கள்.
- [nodeSelector எவ்வாறு பயன்படுத்துவது](/docs/tasks/configure-pod-container/assign-pods-nodes/) அறியுங்கள்.
- [affinity மற்றும் anti-affinity எவ்வாறு பயன்படுத்துவது](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/) அறியுங்கள்.
