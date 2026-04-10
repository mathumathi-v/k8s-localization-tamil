---
reviewers:
- Kashomon
- bprashanth
- madhusudancs
title: ReplicaSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "ReplicaSet"
description: >-
  ஒரு ReplicaSet என்பது எந்த நேரத்திலும் ஒரு நிலையான பிரதி (Replica) Pod-களின் தொகுப்பை இயங்கும் நிலையில் பராமரிக்கிறது.
content_type: concept
weight: 20
hide_summary: true # Listed separately in section index
---

<!-- overview -->

ReplicaSet-இன் நோக்கம் எந்த நேரத்திலும் ஒரு நிலையான பிரதி (Replica) Pod-களின் தொகுப்பை இயங்கும் நிலையில் பராமரிப்பதாகும். எனவே, அது குறிப்பிட்ட எண்ணிக்கையிலான ஒரே மாதிரியான Pod-களின் கிடைக்கக்கூடிய தன்மையை உத்தரவாதப்படுத்தப் பயன்படுகிறது.

<!-- body -->

## ReplicaSet எவ்வாறு செயல்படுகிறது {#how-a-replicaset-works}

ஒரு ReplicaSet, அது கையகப்படுத்தக்கூடிய Pod-களை அடையாளப்படுத்தும் ஒரு தேர்வாளர் (Selector), அது பராமரிக்க வேண்டிய Pod-களின் எண்ணிக்கையைக் குறிப்பிடும் ஒரு பிரதி எண்ணிக்கை, மற்றும் அது தேவையான பிரதி எண்ணிக்கையை பூர்த்தி செய்ய உருவாக்கும் புதிய Pod-களுக்கான தரவைக் குறிப்பிடும் ஒரு Pod template ஆகியவற்றுடன் வரையறுக்கப்படுகிறது. ஒரு ReplicaSet பின்னர் அதன் விரும்பிய எண்ணிக்கையை அடைய தேவைப்படும்போது புதிய Pod-களை உருவாக்கி நீக்குவதன் மூலம் தனது நோக்கத்தை நிறைவேற்றுகிறது. ஒரு ReplicaSet புதிய Pod-களை உருவாக்கும்போது, அது தனது Pod template-ஐப் பயன்படுத்துகிறது.

ஒரு ReplicaSet ownerReferences புலம் மூலம் தனது Pod-களுடன் இணைக்கப்படுகிறது, இது வளங்களுக்கு இடையே உள்ள உரிமையை வழங்குகிறது. ஒரு ReplicaSet-ஆல் சொந்தமான அனைத்து Pod-களும் தங்கள் ownerReferences புலத்தில் அவற்றை சொந்தமாகக் கொண்ட ReplicaSet-இன் அடையாள தகவல்களைக் கொண்டிருக்கும். இந்த இணைப்பின் மூலமே ReplicaSet தான் பராமரிக்கும் Pod-களின் நிலையை அறிகிறது மற்றும் அதற்கேற்ப திட்டமிடுகிறது.

ஒரு ReplicaSet தன் தேர்வாளரைப் (Selector) பயன்படுத்தி கையகப்படுத்த வேண்டிய Pod-களை அடையாளப்படுத்துகிறது. ஒரு Pod-க்கு ownerReference இல்லை அல்லது ownerReference ஒரு {{< glossary_tooltip term_id="controller" >}} அல்ல, மேலும் அது ஒரு ReplicaSet-இன் தேர்வாளருடன் பொருந்தினால், அது உடனடியாக அந்த ReplicaSet-ஆல் கையகப்படுத்தப்படும்.

## ReplicaSet-ஐ எப்போது பயன்படுத்த வேண்டும் {#when-to-use-a-replicaset}

ஒரு ReplicaSet என்பது எந்த நேரத்திலும் குறிப்பிட்ட எண்ணிக்கையிலான Pod பிரதிகள் இயங்குவதை உறுதி செய்கிறது. இருப்பினும், ஒரு Deployment என்பது ReplicaSet-களை நிர்வகிக்கும் மற்றும் Pod-களுக்கு அறிவிப்பு வகை புதுப்பிப்புகளை வழங்குவதோடு மேலும் பல பயனுள்ள வசதிகளையும் வழங்கும் ஒரு உயர்நிலை கருத்தாகும். எனவே, நீங்கள் தனிப்பயன் புதுப்பிப்பு அமைவை தேவைப்படுகிறீர்கள் அல்லது அப்படியே புதுப்பிப்புகளே தேவையில்லை என்று இல்லாவிட்டால், நேரடியாக ReplicaSet-களைப் பயன்படுத்துவதற்கு பதிலாக Deployment-களைப் பயன்படுத்த பரிந்துரைக்கப்படுகிறது.

## எடுத்துக்காட்டு {#example}

{{< codenew file="controllers/frontend.yaml" >}}

இந்த அறிவிப்பு கோப்பை (Manifest) சேமித்து `frontend.yaml` என்று பெயரிட்டு Kubernetes கொத்தில் (Cluster) சமர்ப்பிப்பது கீழே காட்டப்பட்டுள்ள frontend ReplicaSet மற்றும் அது நிர்வகிக்கும் Pod-களை உருவாக்கும்.

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

இதன் பிறகு நீங்கள் நிலவு (deployed) ReplicaSet-களை பெறலாம்:

```shell
kubectl get rs
```

மேலும் நீங்கள் உருவாக்கிய frontend-ஐ காணலாம்:

```
NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
```

ReplicaSet-இன் நிலையை சரிபார்க்கலாம்:

```shell
kubectl describe rs/frontend
```

நீங்கள் இதற்கு இணையான ஒரு வெளியீட்டை காண்பீர்கள்:

```
Name:         frontend
Namespace:    default
Selector:     tier=frontend
Labels:       app=guestbook
              tier=frontend
Annotations:  <none>
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  tier=frontend
  Containers:
   php-redis:
    Image:        us-docker.pkg.dev/google-samples/containers/gke/gb-frontend:v5
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From                   Message
  ----    ------            ----  ----                   -------
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-zbmf5
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-bkrdg
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-hzmfq
```

இறுதியாக, நிலவு (deployed) Pod-களை சரிபார்க்கலாம்:

```shell
kubectl get pods
```

நீங்கள் ReplicaSet-க்கு சொந்தமான Pod தகவல்களை காண்பீர்கள்:

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-bkrdg   1/1     Running   0          19s
frontend-hzmfq   1/1     Running   0          19s
frontend-zbmf5   1/1     Running   0          19s
```

Pod-களின் ownerReferences புலத்தை அமைக்கலாம்:

```shell
kubectl get pods frontend-zbmf5 -o yaml
```

வெளியீடு ReplicaSet-இன் முறையான குறிப்பைக் காண்பிக்கும்:

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2024-02-28T22:30:44Z"
  generateName: frontend-
  labels:
    tier: frontend
  name: frontend-zbmf5
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: frontend
    uid: b8f28ce2-8e9b-4b36-9bd6-39dbc5fe6e3e
  resourceVersion: "40024"
  uid: 0d90b5fb-9eb5-4e41-a4f0-3a927a38e81c
spec:
  ...
```

## Template அல்லாத Pod கையகப்படுத்தல் {#non-template-pod-acquisitions}

நீங்கள் bare Pod-களை நேரடியாக உருவாக்கினாலும், அந்த bare Pod-களுக்கு ஒரு ReplicaSet-இன் தேர்வாளருடன் (Selector) பொருந்தும் முத்திரைகள் (Labels) இல்லை என்பதை உறுதி செய்துகொள்வது நல்லது. ஏனென்றால் ஒரு ReplicaSet ஒரு template-ஆல் உருவாக்கப்பட்ட Pod-களுக்கு மட்டும் சொந்தம் கொண்டாடுவதில்லை — அது முந்தைய பிரிவில் குறிப்பிட்டபடி எந்த Pod-ஐயும் கையகப்படுத்தலாம்.

முந்தைய frontend ReplicaSet எடுத்துக்காட்டையும் கீழே குறிப்பிட்டுள்ள Manifest-களில் குறிப்பிடப்பட்ட Pod-களையும் எடுத்துக்கொள்ளுங்கள்:

{{< codenew file="pods/pod-rs.yaml" >}}

அந்த Pod-களுக்கு ownerReference இல்லாததால் மற்றும் frontend ReplicaSet-இன் தேர்வாளருடன் பொருந்துவதால், அவை உடனடியாக அதனால் கையகப்படுத்தப்படும்.

ReplicaSet நிலவு (deployed) ஆகி இந்த Pod-கள் `Running` நிலையில் உள்ளன என்று வைத்துக்கொள்ளுங்கள், அதன்பிறகு ReplicaSet-இன் மொத்த Pod பிரதிகளின் (Replicas) எண்ணிக்கையை நிரவல் (accommodate) செய்ய அவற்றை ReplicaSet கையகப்படுத்தும், மேலும் அதன் விரும்பிய எண்ணிக்கையை மீறினால் கூடுதல் Pod-களை நீக்கும்.

முதலில் Pod-களை கொண்டு வாருங்கள்:

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

பிறகு frontend ReplicaSet-ஐ கொண்டு வாருங்கள்:

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

ReplicaSet அந்த Pod-களை கையகப்படுத்தியிருக்க வேண்டும், மேலும் விரும்பிய நிலைக்கு ஏற்ப 3 மட்டுமே இருக்க வேண்டும் என்பதால் புதிய Pod-கள் மட்டுமே உருவாக்கப்பட்டிருக்கும் அல்லது எந்த Pod-ம் உருவாக்கப்படவில்லை. Pod-களை பார்க்கலாம்:

```shell
kubectl get pods
```

வெளியீட்டில் புதிய Pod-கள் உருவாக்கப்படவில்லை அல்லது 3 மட்டுமே இருப்பது தெரியும்:

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-hmmj2   1/1     Running   0          9s
pod1             1/1     Running   0          36s
pod2             1/1     Running   0          36s
```

இந்த வகையில், ஒரு ReplicaSet 2 முதல் 5 வரையிலான புதிய Pod-களை சொந்தமாக எடுத்துக்கொள்ளலாம்.

## ReplicaSet Manifest எழுதுதல் {#writing-a-replicaset-manifest}

அனைத்து Kubernetes API பொருட்களைப் போலவே, ஒரு ReplicaSet-க்கும் `apiVersion`, `kind`, மற்றும் `metadata` புலங்கள் தேவைப்படுகின்றன. ReplicaSet-க்கான `kind` புலத்தின் மதிப்பு எப்போதும் `ReplicaSet` ஆகும்.

ஒரு ReplicaSet-க்கான Manifest கோப்பில் `.spec` பகுதியும் தேவைப்படுகிறது.

### Pod Template {#pod-template}

`.spec.template` என்பது முத்திரைகளை (Labels) கொண்டிருக்க வேண்டிய ஒரு [Pod template](/docs/concepts/workloads/pods/#pod-templates) ஆகும். `frontend` ReplicaSet எடுத்துக்காட்டில் நாம் ஒரு முத்திரை `tier: frontend` கொண்டிருந்தோம். மற்ற கட்டுப்படுத்திகளின் (Controllers) தேர்வாளர்களுடன் (Selectors) மோதாமல் இருக்க கவனமாக இருங்கள்.

template-இன் [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) புலமான `.spec.template.spec.restartPolicy` க்கு, `Always` மட்டுமே அனுமதிக்கப்படுகிறது, இது இயல்புநிலை மதிப்பாகும்.

### Pod Selector {#pod-selector}

`.spec.selector` புலம் ஒரு [முத்திரை தேர்வாளர்](/docs/concepts/overview/working-with-objects/labels/) ஆகும். [முன்பே விவாதிக்கப்பட்டது](#how-a-replicaset-works) போல, இவை Pod-களை கையகப்படுத்த பயன்படுத்தப்படும் முத்திரைகள். `frontend` ReplicaSet-இல்:

```yaml
matchLabels:
  tier: frontend
```

ReplicaSet-இல், `.spec.template.metadata.labels` ஆனது `.spec.selector` உடன் பொருந்த வேண்டும், இல்லையெனில் API மறுக்கும்.

{{< note >}}
ஒரே மாதிரியான `.spec.selector` கொண்ட இரண்டு ReplicaSet-கள் இருக்கும் போது ஆனால் வேறுபட்ட `.spec.template.metadata.labels` மற்றும் `.spec.template.spec` கொண்டிருக்கும் போது, ஒவ்வொரு ReplicaSet-ம் மற்றொரு ReplicaSet-ஆல் உருவாக்கப்பட்ட Pod-களை புறக்கணிக்கும்.
{{< /note >}}

### பிரதிகள் {#replicas}

`.spec.replicas` புலத்தை அமைப்பதன் மூலம் ஒரே நேரத்தில் இயங்க வேண்டிய Pod-களின் எண்ணிக்கையை குறிப்பிடலாம். ReplicaSet அந்த எண்ணிக்கையை பூர்த்தி செய்ய Pod-களை உருவாக்கும் அல்லது நீக்கும்.

`.spec.replicas` குறிப்பிடப்படவில்லை என்றால், இயல்பாக 1 என்று அமைக்கப்படும்.

## ReplicaSet-களுடன் பணிசெய்தல் {#working-with-replicasets}

### ReplicaSet மற்றும் அதன் Pod-களை நீக்குதல் {#deleting-a-replicaset-and-its-pods}

ஒரு ReplicaSet மற்றும் அதன் அனைத்து Pod-களையும் நீக்க [`kubectl delete`](/docs/reference/kubectl/generated/kubectl_delete/) கட்டளையைப் பயன்படுத்தவும். Garbage collector இயல்பாகவே அனைத்து சார்ந்த Pod-களையும் தானாகவே நீக்கும்.

REST API அல்லது `client-go` நூலகத்தைப் பயன்படுத்தும் போது, நீக்கு கோரிக்கையில் `propagationPolicy` ஐ `Background` அல்லது `Foreground` என்று அமைக்க வேண்டும். எடுத்துக்காட்டாக:

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
  -H "Content-Type: application/json"
```

### Pod-களை மட்டும் நீக்குதல் {#deleting-just-a-replicaset}

ReplicaSet-ஐ நீக்காமல் அதன் Pod-களை மட்டும் நீக்க `--cascade=orphan` விருப்பத்துடன் `kubectl delete` பயன்படுத்தவும். உதாரணமாக:

```shell
kubectl delete rs frontend --cascade=orphan
```

மூல ReplicaSet நீக்கப்பட்டவுடன், புதிய ReplicaSet-ஐ அல்லது அதை மாற்ற வேறு ஒன்றை உருவாக்கலாம். `.spec.selector` ஒன்றாக இருக்கும் வரை, புதிய ReplicaSet பழைய Pod-களை ஏற்றுக்கொள்ளும். இருப்பினும், Pod template மாற்றத்தோடு பொருந்த புதிய அல்லது தற்போதுள்ள Pod-களை புதுப்பிக்க முயற்சிக்காது. புதிய spec-உடன் Pod-களை புதுப்பிக்க [Deployment](/docs/concepts/workloads/controllers/deployment/#creating-a-deployment) ஐப் பயன்படுத்தவும், ஏனெனில் ReplicaSet-கள் rolling update-ஐ நேரடியாக ஆதரிப்பதில்லை.

### ReplicaSet இலிருந்து Pod-களை தனிமைப்படுத்துதல் {#isolating-pods-from-a-replicaset}

ஒரு ReplicaSet-இலிருந்து Pod-களை தங்கள் முத்திரைகளை (Labels) மாற்றுவதன் மூலம் அகற்றலாம். இந்த நுட்பம் சேவையிலிருந்து (debugging) Pod-களை பிரிக்க, தரவு மீட்டெடுப்புக்கு, போன்றவற்றிற்கு பயன்படுத்தலாம். இவ்வாறு அகற்றப்பட்ட Pod-கள் தானாகவே புதியதால் மாற்றப்படும் (அதன் பிரதி எண்ணிக்கை மாறவில்லை என்று கருதி).

### ReplicaSet-ஐ அளவிடல் {#scaling-a-replicaset}

ஒரு ReplicaSet-ஐ `kubectl scale` கட்டளையைப் பயன்படுத்தி எளிதாக அளவிடலாம் (Scale). உதாரணமாக:

```shell
kubectl scale --replicas=6 rs/frontend
```

ReplicaSet-இல் `.spec.replicas` புலத்தை புதுப்பிப்பதன் மூலமும் அளவிடலாம் (Scale):

```shell
kubectl patch rs frontend -p '{"spec":{"replicas":6}}'
```

### Pod நீக்க செலவு {#pod-deletion-cost}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

[`controller.kubernetes.io/pod-deletion-cost`](/docs/reference/labels-annotations-taints/#controller-kubernetes-io-pod-deletion-cost) குறிப்பை (Annotation) பயன்படுத்தி, ReplicaSet-ஐ அளவைக் குறைக்கும்போது (scale down) எந்த Pod-களை முதலில் அகற்ற வேண்டும் என்பதை கட்டுப்படுத்தலாம்.

இந்த குறிப்பு Pod-இல் அமைக்கப்பட வேண்டும், வரம்பு [-2147483648, 2147483647] உள்ளது. இது ஒரு Pod-ஐ நீக்குவதற்கான செலவை குறிக்கிறது மற்ற Pod-களுடன் ஒப்பிடும்போது. குறைந்த நீக்கல் செலவு கொண்ட Pod-கள் அதிக நீக்கல் செலவு கொண்ட Pod-களுக்கு முன்னரே நீக்கப்படும்.

இந்த குறிப்பின் மதிப்பு வழக்கமற்றதாக அல்லது செல்லாததாக இருந்தால், அது 0 ஆக கருதப்படும்.

### Horizontal Pod Autoscaler (HPA) இன் இலக்காக ReplicaSet {#replicaset-as-a-horizontal-pod-autoscaler-target}

ஒரு ReplicaSet [Horizontal Pod Autoscaler (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/) இன் இலக்காகவும் இருக்கலாம். அதாவது, ஒரு ReplicaSet-ஐ ஒரு HPA ஆல் தானாகவே அளவிடலாம் (auto-scaled). இங்கே ஒரு HPA உதாரணம் கொடுக்கப்பட்டுள்ளது, அது முந்தைய எடுத்துக்காட்டில் உருவாக்கிய ReplicaSet-ஐ இலக்காகக் கொண்டுள்ளது.

{{< codenew file="controllers/hpa-rs.yaml" >}}

இந்த Manifest-ஐ `hpa-rs.yaml` என்று சேமித்து அதை ஒரு Kubernetes கொத்தில் (Cluster) சமர்ப்பிப்பது CPU பயன்பாட்டின் அடிப்படையில் frontend Pod-களை பிரதி எடுக்கும் ஒரு HPA-ஐ உருவாக்கும்.

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/hpa-rs.yaml
```

மாற்றாக, `kubectl autoscale` கட்டளையைப் பயன்படுத்தி அதே விளைவை அடையலாம் (இது மிகவும் எளிமையானது):

```shell
kubectl autoscale rs frontend --max=10 --min=3 --cpu-percent=50
```

## மாற்றீடுகள் {#alternatives-to-replicaset}

### Deployment (பரிந்துரைக்கப்படுகிறது) {#deployment-recommended}

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) என்பது ReplicaSet-களை சொந்தமாகக் கொண்டு, அவற்றை புதுப்பிக்கக்கூடிய மற்றும் அறிவிப்பு வகை, சேவை-பக்க புதுப்பிப்புகளை Pod-களுக்கு அளிக்கக்கூடிய ஒரு object ஆகும். ReplicaSet-கள் நேரடியாகவும் பயன்படுத்தப்படலாம், ஆனால் இன்று அவை பெரும்பாலும் Deployment-கள் மூலம் வழிகாட்டப்படுகின்றன. எனவே Deployment-களைப் பயன்படுத்த பரிந்துரைக்கப்படுகிறது மற்றும் ReplicaSet object-களை நேரடியாக நிர்வகிக்க வேண்டியதில்லை.

### Bare Pod-கள் {#bare-pods}

நேரடியாக Pod-களை உருவாக்கும் வழக்கத்திற்கு மாறாக, ஒரு ReplicaSet அல்லது Deployment Pod failure-களை இயல்பாகவே கையாளும் என்பதால் Deployment-களைப் பயன்படுத்துவது பரிந்துரைக்கப்படுகிறது. ஒரு Node தோல்விப்படும்போது அல்லது கொத்திலிருந்து (Cluster) இடப்பெயர்வு நிகழும்போது, Bare Pod-கள் மீண்டும் திட்டமிடப்பட மாட்டாது, ஆனால் ஒரு ReplicaSet-ஆல் நிர்வகிக்கப்படும் Pod-கள் மீண்டும் திட்டமிடப்படும்.

### Job

நிறைவுக்கு இட்டுச்செல்ல வேண்டிய Pod-களுக்கு (அதாவது, batch வேலைகள்) ReplicaSet-க்கு பதிலாக [`Job`](/docs/concepts/workloads/controllers/job/) ஐப் பயன்படுத்தவும்.

### DaemonSet

ஒரு Node நிலை கண்காணிப்பு அல்லது Node logging போன்ற machine-level செயல்பாட்டை வழங்கும் Pod-களுக்கு ReplicaSet-க்கு பதிலாக [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) ஐப் பயன்படுத்தவும். இந்த Pod-களின் ஆயுட்காலம் ஒரு இயந்திர (machine) ஆயுட்காலத்துடன் கட்டுண்டுள்ளது: மற்ற Pod-கள் தொடங்கும் முன் Pod தொடங்க வேண்டும், மேலும் Node மறுதொடக்கம்/நிறுத்தத்திற்கு தயாராக இருக்கும்போது பாதுகாப்பாக நிறுத்தப்படலாம்.

### ReplicationController

ReplicaSet-கள் [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)-களுக்கு அடுத்தவை (successors). இரண்டும் ஒரே நோக்கத்திற்காக சேவை செய்கின்றன மற்றும் ஒரே மாதிரியாக செயல்படுகின்றன, தவிர ReplicationController-கள் [முத்திரை பயனர் வழிகாட்டியில்](/docs/concepts/overview/working-with-objects/labels/#label-selectors) விவரிக்கப்பட்டுள்ள set-based selector தேவைகளை ஆதரிப்பதில்லை. எனவே, ReplicaSet-கள் ReplicationController-களை விட விரும்பப்படுகின்றன.

## {{% heading "whatsnext" %}}

* [Pod-களைப்](/docs/concepts/workloads/pods/) பற்றி அறிக.
* [Deployment-களைப்](/docs/concepts/workloads/controllers/deployment/) பற்றி அறிக.
* [Deployment-ஐப் பயன்படுத்தி ஒரு Stateless Application இயக்குதல்](/docs/tasks/run-application/run-stateless-application-deployment/) பற்றி அறிக, இது ReplicaSet-களை நம்பியுள்ளது.
* `ReplicaSet` என்பது ஒரு Kubernetes REST API-யில் ஒரு உயர்நிலை resource ஆகும். ReplicaSet API-ஐ புரிந்துகொள்ள {{< api-reference page="workload-resources/replica-set-v1" >}} object வரையறையைப் படிக்கவும்.
* [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) பற்றி படிக்கவும், மற்றும் disruption-களின் போது பயன்பாட்டு கிடைக்கக்கூடிய தன்மையை நிர்வகிக்க அதை எவ்வாறு பயன்படுத்தலாம் என்று அறியுங்கள்.
