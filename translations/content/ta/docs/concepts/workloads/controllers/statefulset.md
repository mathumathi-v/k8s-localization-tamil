---
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
title: StatefulSet-கள்
api_metadata:
- apiVersion: "apps/v1"
  kind: "StatefulSet"
description: >-
  ஒரு StatefulSet என்பது Pod-களின் தொகுப்பை நிர்வகிக்கிறது மற்றும் ஒவ்வொரு Pod-க்கும் நிலையான அடையாளத்தை பராமரிக்கிறது. நிலையான சேமிப்பு (persistent storage) அல்லது நிலையான, தனித்துவமான நெட்வொர்க் அடையாளம் தேவைப்படும் பயன்பாடுகளை நிர்வகிப்பதற்கு இது பயனுள்ளதாக இருக்கும்.
content_type: concept
weight: 40
hide_summary: true
---

<!-- overview -->

StatefulSet என்பது நிலையான பயன்பாட்டு பணிச்சுமை (stateful workload) {{< glossary_tooltip text="பணிச்சுமை" term_id="workload" >}} API பொருளாகும். இது ஒரு குழு Pod-களை இயக்கும் அதே நேரத்தில் ஒவ்வொரு Pod-க்கும் ஒரு நிலையான அடையாளத்தை (sticky identity) பராமரிக்கிறது. நிலையான சேமிப்பு (persistent storage) அல்லது நிலையான, தனித்துவமான நெட்வொர்க் அடையாளம் தேவைப்படும் பயன்பாடுகளை நிர்வகிப்பதற்கு இது பயனுள்ளதாக இருக்கும்.

Deployment-ஐப் போலவே, ஒரு StatefulSet ஒரே மாதிரியான கொள்கலன் (Container) விவரக்குறிப்பின் அடிப்படையில் Pod-களை நிர்வகிக்கிறது. ஆனால் Deployment-இலிருந்து மாறுபாடாக, ஒரு StatefulSet ஒவ்வொரு Pod-க்கும் ஒரு நிலையான அடையாளத்தை பராமரிக்கிறது. இந்த Pod-கள் ஒன்றுக்கொன்று மாற்றீடு செய்யக்கூடியவை அல்ல — ஒவ்வொன்றும் எந்த மறுதிட்டமிடலிலும் (rescheduling) தொடர்ந்து பராமரிக்கப்படும் நிலையான அடையாளங்களைக் கொண்டுள்ளன.

<!-- body -->

## StatefulSet-கள் பயன்படுத்துதல் {#using-statefulsets}

StatefulSet-கள் பின்வருவனவற்றில் ஒன்று அல்லது அதிகம் தேவைப்படும் பயன்பாடுகளுக்கு மதிப்புமிக்கவை:

* நிலையான, தனித்துவமான நெட்வொர்க் அடையாளங்கள் (stable, unique network identifiers).
* நிலையான, நிலைத்திருக்கும் சேமிப்பு (stable, persistent storage).
* வரிசைப்படுத்தப்பட்ட, கவனமான வரிசைப்படுத்தல் (deployment) மற்றும் அளவிடல் (Scaling).
* வரிசைப்படுத்தப்பட்ட, தானியங்கி உருளும் புதுப்பிப்புகள் (automated rolling updates).

மேற்கண்ட தேவைகள் இல்லாத பயன்பாட்டிற்கு, நீங்கள் Deployment அல்லது ReplicaSet ஐப் பயன்படுத்துவதே சரியானது.

## கட்டுப்பாடுகள் {#limitations}

* ஒரு Pod-க்கான சேமிப்பு ஒரு [PersistentVolume Provisioner](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md) ஆல் கோரப்பட்ட `storage class` அடிப்படையில் வழங்கப்பட வேண்டும், அல்லது ஒரு நிர்வாகியால் முன்கூட்டியே வழங்கப்பட வேண்டும்.
* ஒரு StatefulSet-ஐ நீக்குவது அல்லது குறைக்கும்போது அதனுடன் தொடர்புடைய தொகுதிகளை (Volumes) *நீக்காது*. தரவு பாதுகாப்பு உறுதி செய்ய இவ்வாறு செய்யப்படுகிறது. இது பொதுவாக தொடர்புடைய StatefulSet வளங்கள் அனைத்தையும் தானாக சுத்தம் செய்வதை விட அதிக மதிப்புமிக்கது.
* StatefulSet-கள் தற்போது Pod-களின் நெட்வொர்க் அடையாளத்திற்கு பொறுப்பாக இருக்க ஒரு [Headless Service](/docs/concepts/services-networking/service/#headless-services) தேவைப்படுகின்றன. இந்த சேவையை (Service) நீங்களே உருவாக்க வேண்டும்.
* StatefulSet-களை நீக்கும்போது Pod நிறுத்தத்திற்கான உத்தரவாதங்கள் வழங்கப்படவில்லை. StatefulSet-இல் Pod-களை வரிசையாகவும் கவனமாகவும் நிறுத்த விரும்பினால், நீக்குவதற்கு முன் StatefulSet-ஐ 0 ஆக அளவிடலாம்.
* இயல்புநிலை [Pod Management Policy](#pod-management-policies) (`OrderedReady`) உடன் [Rolling Updates](#rolling-updates) பயன்படுத்தும்போது, கைமுறை தலையீடு தேவைப்படும் உடைந்த நிலைக்கு வருவது சாத்தியமாகும்.

## கூறுகள் {#components}

கீழேயுள்ள உதாரணம் ஒரு StatefulSet-இன் கூறுகளை விளக்குகிறது.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # .spec.template.metadata.labels உடன் பொருந்த வேண்டும்
  serviceName: "nginx"
  replicas: 3 # இயல்புநிலை 1
  minReadySeconds: 10 # இயல்புநிலை 0
  template:
    metadata:
      labels:
        app: nginx # .spec.selector.matchLabels உடன் பொருந்த வேண்டும்
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

மேற்கண்ட உதாரணத்தில்:

* `nginx` என்ற Headless Service, நெட்வொர்க் டொமைனை கட்டுப்படுத்துவதற்கு பயன்படுத்தப்படுகிறது.
* `web` என்ற StatefulSet-ல் 3 nginx கொள்கலன்களின் (Containers) பிரதிகள் (Replicas) இயங்கும் என்று விவரக்குறிப்பு கூறுகிறது.
* `volumeClaimTemplates` ஆனது PersistentVolume Provisioner-ஆல் வழங்கப்படும் PersistentVolumeClaim-களைப் பயன்படுத்தி நிலையான சேமிப்பை வழங்கும்.

StatefulSet-இன் பெயர் ஒரு சரியான [DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names) ஆக இருக்க வேண்டும்.

### Pod தேர்வாளர் (Pod Selector) {#pod-selector}

StatefulSet-இன் `.spec.selector` புலத்தை `.spec.template.metadata.labels` உடன் பொருந்தும்படி அமைக்க வேண்டும். Kubernetes 1.8 க்கு முன்பு, `.spec.selector` புலம் தவிர்க்கப்பட்டால் இயல்புநிலையாக அமைக்கப்பட்டது. 1.8 மற்றும் அதற்கு பிந்தைய பதிப்புகளில், பொருந்தும் Pod தேர்வாளரை (Pod Selector) குறிப்பிடத் தவறினால் StatefulSet உருவாக்கும் போது ஒரு சரிபார்ப்பு பிழை ஏற்படும்.

### தொகுதி கோரிக்கை வார்ப்புருக்கள் (Volume Claim Templates) {#volume-claim-templates}

PersistentVolume-களை வழங்குவதற்கு இரண்டு வழிகள் உள்ளன:

* [PersistentVolume Provisioner](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md) கோரப்பட்ட `storage class` அடிப்படையில் தானாக வழங்கும் — `StorageClass` dynamic provisioning-ஐ ஆதரிக்க வேண்டும்.
* அல்லது, நிர்வாகி ஏற்கனவே சரியான `StorageClass`-உடன் போதுமான சேமிப்புடன் ஒரு PersistentVolume-ஐ கைமுறையாக உருவாக்கியிருக்க வேண்டும்.

### குறைந்தபட்ச தயார் நொடிகள் (Minimum Ready Seconds) {#minimum-ready-seconds}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

`.spec.minReadySeconds` என்பது புதிதாக உருவாக்கப்பட்ட ஒரு Pod, கொள்கலன்கள் எதுவும் செயலிழக்காமல் இயங்கி தயாராக இருக்க வேண்டிய குறைந்தபட்ச நொடிகளின் எண்ணிக்கையை குறிப்பிடும் ஒரு விருப்பப் புலமாகும். இது Pod "கிடைக்கக்கூடியது" என்று கருதப்படுவதற்கு முன்பாக அவசியம். Rolling Update உத்தி (Rolling Update strategy) உடன் rollout முன்னேற்றத்தை சரிபார்க்க இது பயன்படுகிறது. இந்த புலம் இயல்புநிலையாக `0` ஆக இருக்கும் (Pod தயாராகும் உடனே கிடைக்கக்கூடியது என்று கருதப்படும்). StatefulSet-களில் `minReadySeconds` எவ்வாறு செயல்படுகிறது என்பது பற்றி மேலும் அறிய, [Deployment-களுக்கான குறைந்தபட்ச தயார் நொடிகள்](/docs/concepts/workloads/controllers/deployment/#min-ready-seconds) பார்க்கவும்.

## Pod அடையாளம் (Pod Identity) {#pod-identity}

StatefulSet Pod-களுக்கு ஒரு தனித்துவமான அடையாளம் உள்ளது, இது ஒரு வரிசை குறியீட்டை (ordinal), ஒரு நிலையான நெட்வொர்க் அடையாளத்தை மற்றும் நிலையான சேமிப்பை உள்ளடக்கியது. Pod எந்த Node-இல் (மீண்டும்) திட்டமிடப்பட்டாலும் அடையாளம் அப்படியே ஒட்டிக்கொள்கிறது.

### வரிசை குறியீடு (Ordinal Index) {#ordinal-index}

N பிரதிகளுடன் கூடிய ஒரு StatefulSet-க்கு, StatefulSet-இல் உள்ள ஒவ்வொரு Pod-க்கும் 0 முதல் N-1 வரையிலான ஒரு முழு எண் வரிசை குறியீடு (integer ordinal) ஒதுக்கப்படும். StatefulSet-இல் இது தனித்துவமானது. குறிப்பிட்ட `.spec.ordinals` ஐக் கொண்டு கட்டமைக்கப்படாவிட்டால், வரிசை குறியீடுகள் இயல்பாக 0 முதல் தொடங்கும்.

### தொடக்க வரிசை குறியீடு (Start Ordinal) {#start-ordinal}

{{< feature-state for_k8s_version="v1.31" state="stable" >}}

`.spec.ordinals` என்பது StatefulSet-இல் ஒதுக்கப்படும் வரிசை குறியீட்டை (integer ordinal) கட்டமைக்க அனுமதிக்கும் ஒரு விருப்பப் புலமாகும்.

`.spec.ordinals.start`: இந்த புலம் அமைக்கப்பட்டால், Pod-களுக்கு `.spec.ordinals.start` முதல் `.spec.ordinals.start + .spec.replicas - 1` வரையிலான வரிசை குறியீடுகள் ஒதுக்கப்படும்.

### நிலையான நெட்வொர்க் அடையாளம் (Stable Network ID) {#stable-network-id}

ஒவ்வொரு Pod-ம் StatefulSet பெயர் மற்றும் Pod-இன் வரிசை குறியீட்டிலிருந்து (ordinal) அதன் hostname-ஐ பெறுகிறது. Constructed hostname-இன் மாதிரி `$(statefulset name)-$(ordinal)` ஆகும். மேலே உள்ள உதாரணம் `web-0,web-1,web-2` என்ற பெயர்களுடைய மூன்று Pod-களை உருவாக்கும்.

ஒரு StatefulSet, StatefulSet-இல் உள்ள Pod-களின் டொமைனை கட்டுப்படுத்த ஒரு [Headless Service](/docs/concepts/services-networking/service/#headless-services) ஐப் பயன்படுத்தலாம். இந்த சேவை (Service) நிர்வகிக்கும் டொமைன் `$(service name).$(namespace).svc.cluster.local` வடிவத்தில் இருக்கும், இங்கு "cluster.local" என்பது கொத்தின் (Cluster) டொமைன் ஆகும்.
ஒவ்வொரு Pod-ம் உருவாக்கப்படுவதால், அது `$(podname).$(governing service domain)` வடிவத்தில் ஒரு பொருந்தும் DNS துணை டொமைன் (DNS subdomain) பெறுகிறது, இங்கு governing service என்பது StatefulSet-இன் `serviceName` புலத்தால் வரையறுக்கப்படுகிறது.

கொத்தின் (Cluster) DNS கட்டமைக்கப்பட்ட விதத்தைப் பொறுத்து, புதிதாக இயக்கப்பட்ட Pod-இன் DNS பெயரை உடனடியாக தேடுவது சாத்தியமாகாமல் போகலாம். இந்த நடத்தை கொத்தில் (Cluster) உள்ள மற்ற கிளையண்டுகள் Pod-ஐ உருவாக்கிய நேரத்திற்கு முன்பே அதற்கான hostname-ஐ தீர்க்க (resolve) முயற்சிக்கும்போது ஏற்படலாம். Negative caching (DNS-இல் இயல்பானது) என்பது Pod இயங்கத் தொடங்கிய பின்னரும் சில நொடிகள் வரை முந்தைய (fail ஆன) தேடல்கள் நினைவகத்தில் வைக்கப்பட்டு மீண்டும் பயன்படுத்தப்படும் என்பதாகும்.

Pod-களை உருவாக்கிய பிறகு சீக்கிரமாக (அல்லது உடனடியாக) Pod-களை DNS-ஆல் கண்டறிய வேண்டும் என்றால், பின்வரும் சில விருப்பங்களை ஆராயலாம்:

* DNS தேடல்களை நம்பாமல் Kubernetes API-ஐ நேரடியாக query செய்யுங்கள் (உதாரணமாக, watch பயன்படுத்தி).
* Kubernetes DNS provider-இல் caching நேரத்தை (TTL) குறைக்கவும், பொதுவாக CoreDNS ConfigMap-இல். (குறிப்பு: TTL-ஐ குறைப்பது CoreDNS cache-இன் சுமையை அதிகரிக்கலாம்)
* உங்கள் StatefulSet-ஐ பொறுத்தவரை, [PublishNotReadyAddresses](https://kubernetes.io/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceSpec) ஐ `true` ஆக அமைக்கவும்.

கீழ்கண்ட அட்டவணை Cluster டொமைன், சேவை (Service) பெயர், StatefulSet பெயர், மற்றும் அது StatefulSet Pod-களின் DNS பெயர்களை எவ்வாறு பாதிக்கிறது என்பதை விளக்குகிறது.

| Cluster டொமைன் | சேவை (ns/பெயர்) | StatefulSet (ns/பெயர்) | StatefulSet டொமைன் | Pod DNS | Pod Hostname |
| -------------- | --------------- | ---------------------- | ------------------- | ------- | ------------ |
| cluster.local | default/nginx | default/web | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
| cluster.local | foo/nginx | foo/web | nginx.foo.svc.cluster.local | web-{0..N-1}.nginx.foo.svc.cluster.local | web-{0..N-1} |
| kube.local | foo/nginx | foo/web | nginx.foo.svc.kube.local | web-{0..N-1}.nginx.foo.svc.kube.local | web-{0..N-1} |

{{< note >}}
Cluster டொமைன் [வேறுவிதமாக கட்டமைக்கப்படாவிட்டால்](/docs/concepts/services-networking/dns-pod-service/) `cluster.local` ஆக இருக்கும்.
{{< /note >}}

### நிலையான சேமிப்பு (Stable Storage) {#stable-storage}

`volumeClaimTemplates`-இல் வரையறுக்கப்பட்ட ஒவ்வொரு VolumeClaimTemplate-க்கும், Kubernetes ஒவ்வொரு Pod-க்கும் ஒரு PersistentVolumeClaim (PVC) உருவாக்குகிறது. மேலே உள்ள nginx உதாரணத்தில், ஒவ்வொரு Pod-ம் `my-storage-class` StorageClass-உடன் 1 Gib சேமிப்புடன் ஒரு PersistentVolumeClaim-ஐ பெறும் — இது `www` என்று பெயரிடப்பட்டுள்ளது. Pod மீண்டும் திட்டமிடப்படும்போது (rescheduled), அதன் `volumeMounts` PersistentVolumeClaim-களுடன் தொடர்புடைய PersistentVolume-களை mount செய்யும். StatefulSet அல்லது அதன் Pods நீக்கப்படும்போது இந்த PVC-கள் மற்றும் அதனுடன் தொடர்புடைய தொகுதிகள் (Volumes) நீக்கப்படாது.

{{< note >}}
PersistentVolumeClaim-களிலுள்ள PersistentVolume-கள், manual அல்லது [PVC retention policy](#persistentvolumeclaim-retention) ஐப் பயன்படுத்தி நீக்கப்பட வேண்டும்.
{{< /note >}}

### Pod பெயர் முத்திரை (Pod Name Label) {#pod-name-label}

StatefulSet {{< glossary_tooltip term_id="controller" >}} ஒரு Pod உருவாக்கும்போது, `statefulset.kubernetes.io/pod-name` முத்திரையை (label) Pod-இல் சேர்க்கிறது. இந்த முத்திரை StatefulSet-இல் ஒரு குறிப்பிட்ட Pod-க்கு ஒரு Service-ஐ இணைக்க (attach) உதவுகிறது.

### Pod குறியீடு முத்திரை (Pod Index Label) {#pod-index-label}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

StatefulSet {{< glossary_tooltip term_id="controller" >}} ஒரு Pod உருவாக்கும்போது, `apps.kubernetes.io/pod-index` முத்திரை புதிய Pod-இல் சேர்க்கப்படுகிறது. இந்த முத்திரையின் மதிப்பு Pod-இன் வரிசை குறியீடாகும் (ordinal index). இந்த முத்திரை ஒரு குறிப்பிட்ட Pod குறியீட்டிற்கான traffic-ஐ route செய்ய, Pod தேர்வாளரைப் (Pod selector) பயன்படுத்தி, ஒரு சேவையை (Service) ஒரு குறிப்பிட்ட Pod குறியீட்டுடன் இணைக்க பயன்படுகிறது.

## வரிசைப்படுத்தல் மற்றும் அளவிடல் உத்தரவாதங்கள் (Deployment and Scaling Guarantees) {#deployment-and-scaling-guarantees}

* N பிரதிகள் (Replicas) கொண்ட ஒரு StatefulSet-க்கு, Pod-கள் வரிசைப்படுத்தப்படும்போது, அவை `{0..N-1}` வரிசையில் தொடர்ச்சியாக உருவாக்கப்படும்.
* Pod-கள் நீக்கப்படும்போது, அவை `{N-1..0}` தலைகீழ் வரிசையில் நிறுத்தப்படும்.
* ஒரு Pod-க்கு scale down செயல்பாடு பயன்படுத்தப்படுவதற்கு முன்பு, அதற்கு முந்தைய அனைத்து Pod-களும் Running மற்றும் Ready நிலையில் இருக்க வேண்டும்.
* ஒரு Pod நிறுத்தப்படுவதற்கு முன்பு, அதற்கு பிந்தைய அனைத்து Pod-களும் முழுமையாக மூடப்பட்டிருக்க வேண்டும்.

StatefulSet `pod.spec.terminationGracePeriodSeconds`-ஐ 0 ஆக குறிப்பிட வேண்டாம். இந்த நடைமுறை பாதுகாப்பற்றது மற்றும் மிகவும் ஊக்கப்படுத்தப்படாதது. மேலும் விளக்கத்திற்கு, [StatefulSet Pod-களை நீக்குதல்](/docs/tasks/run-application/force-delete-stateful-set-pod/) பார்க்கவும்.

மேலே உள்ள nginx உதாரணம் உருவாக்கப்படும்போது, மூன்று Pod-கள் `web-0`, `web-1`, `web-2` என்ற வரிசையில் வரிசைப்படுத்தப்படும். `web-1` வரிசைப்படுத்தப்படுவதற்கு முன்பு `web-0` [Running மற்றும் Ready](/docs/concepts/workloads/pods/pod-lifecycle/) நிலையில் இருக்க வேண்டும், `web-2` வரிசைப்படுத்தப்படுவதற்கு முன்பு `web-1` Running மற்றும் Ready நிலையில் இருக்க வேண்டும். `web-1` Running மற்றும் Ready நிலைக்கு வந்த பிறகு ஆனால் `web-2` தொடங்கப்படுவதற்கு முன்பு `web-0` தோல்வியுற்றால், `web-2` `web-0` மீண்டும் வெற்றிகரமாக தொடங்கி Running மற்றும் Ready நிலைக்கு வரும் வரை தொடங்கப்படாது.

பயனர் StatefulSet-இல் பிரதிகளின் (Replicas) எண்ணிக்கையை 1 ஆக குறைக்க patch செய்தால், `web-2` முதலில் நிறுத்தப்படும். `web-2` முழுமையாக மூடப்பட்டு நீக்கப்படும் வரை `web-1` மூடப்படாது. `web-2` மூடப்பட்டு முழுமையாக நீக்கப்படும் முன்பு `web-0` தோல்வியுற்றால், `web-0` Running மற்றும் Ready நிலைக்கு திரும்பும் வரை `web-1` மூடப்படாது.

### Pod நிர்வாக கொள்கைகள் (Pod Management Policies) {#pod-management-policies}

{{< feature-state for_k8s_version="v1.7" state="stable" >}}

Kubernetes, `.spec.podManagementPolicy` புலத்தின் மூலம் StatefulSet-இல் இருந்து வழங்கப்படும் இயல்புநிலை வரிசைப்படுத்தல் உத்தரவாதங்களை தளர்த்த அனுமதிக்கிறது.

#### OrderedReady Pod நிர்வாகம் {#orderedready-pod-management}

`OrderedReady` Pod நிர்வாகம் StatefulSet-களுக்கான இயல்புநிலையாகும். இது [மேலே](#deployment-and-scaling-guarantees) விவரிக்கப்பட்ட நடத்தையை செயல்படுத்துகிறது.

#### Parallel Pod நிர்வாகம் {#parallel-pod-management}

`Parallel` Pod நிர்வாகம் StatefulSet controller-ஐ அனைத்து Pod-களையும் இணையாக (parallel) தொடங்கவோ அல்லது நிறுத்தவோ கூறுகிறது. மற்ற Pod-கள் Running மற்றும் Ready நிலை அல்லது முழுமையாக மூடப்பட்டிருப்பதற்காக காத்திருக்காமல் அவ்வாறு செய்கிறது. இந்த விருப்பம் ஒரு StatefulSet-இன் Pod-களை scale up அல்லது scale down செய்வதை மட்டும் பாதிக்கிறது. புதுப்பிப்புகள் (Updates) பாதிக்கப்படாது.

## புதுப்பிப்பு உத்திகள் (Update Strategies) {#update-strategies}

ஒரு StatefulSet-இன் `.spec.updateStrategy` புலம், StatefulSet-இல் உள்ள Pod-களுக்கான கொள்கலன் (Container) இமேஜ்கள், வளக் கோரிக்கைகள்/வரம்புகள் (resource requests/limits) மற்றும் முத்திரைகள் (labels) தானியங்கி உருளும் புதுப்பிப்புகளை கட்டமைக்க அல்லது முடக்க உதவுகிறது.

### OnDelete

`OnDelete` புதுப்பிப்பு உத்தி ஒரு legacy (1.6 மற்றும் அதற்கு முந்தைய) நடத்தையை செயல்படுத்துகிறது. `.spec.updateStrategy.type` ஆனது `OnDelete` ஆக அமைக்கப்படும்போது, StatefulSet controller அதன் Pod-களை தானாக புதுப்பிக்காது. `.spec.template`-ஐ புதுப்பிக்கும்போது StatefulSet-ஐ புதிய Pod-களை உருவாக்க வைக்க பயனர்கள் Pod-களை கைமுறையாக நீக்க வேண்டும்.

### RollingUpdate

`RollingUpdate` புதுப்பிப்பு உத்தி StatefulSet-இல் உள்ள Pod-களுக்கான தானியங்கி, உருளும் புதுப்பிப்பை (rolling update) செயல்படுத்துகிறது. இது `.spec.updateStrategy` குறிப்பிடப்படாவிட்டால் இயல்புநிலை உத்தியாகும்.

## உருளும் புதுப்பிப்புகள் (Rolling Updates) {#rolling-updates}

`RollingUpdate` புதுப்பிப்பு உத்தி ஒரு StatefulSet-இல் உள்ள அனைத்து Pod-களையும் தலைகீழ் வரிசை குறியீட்டில் (reverse ordinal order) புதுப்பிக்கிறது, ஒவ்வொரு Pod-ஐயும் புதுப்பிக்கும்போது அதன் முந்தைய நிலையை கடைப்பிடிக்கிறது.

StatefulSet controller ஒவ்வொரு Pod-ஐயும் புதுப்பிக்கும், அடுத்த Pod-ஐ புதுப்பிப்பதற்கு முன்பு புதுப்பிக்கப்பட்ட Pod Running மற்றும் Ready நிலைக்கு வரும் வரை காத்திருக்கும். குறிப்பிடப்பட்டால், `.spec.minReadySeconds` இல் குறிப்பிட்ட காலம் தயாரான பின்பு Pod கிடைக்கக்கூடியது என்று கருதப்படும்.

### பகிர்வு செய்யப்பட்ட உருளும் புதுப்பிப்புகள் (Partitioned Rolling Updates) {#partitions}

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

`.spec.updateStrategy.rollingUpdate.partition` குறிப்பிட்டால் `RollingUpdate` உத்தியை பகிர்வு (partition) செய்யலாம். ஒரு partition குறிப்பிட்டால், வரிசை குறியீடு partition-ஐ விட அல்லது சமனான Pod-கள் மட்டும் புதுப்பிக்கப்படும். partition-ஐ விட குறைவான வரிசை குறியீட்டுடைய Pod-கள், அவை நீக்கப்பட்டாலும் கூட புதுப்பிக்கப்படமாட்டாது. StatefulSet-இன் `.spec.updateStrategy.rollingUpdate.partition` அதன் `.spec.replicas`-ஐ விட அதிகமாக இருந்தால், அதன் `.spec.template`-க்கான புதுப்பிப்புகள் எந்த Pod-ஐயும் பாதிக்காது. பெரும்பாலான சந்தர்ப்பங்களில் partition-ஐப் பயன்படுத்த வேண்டியதில்லை, ஆனால் ஒரு புதுப்பிப்பை நிலைப்படுத்த விரும்பினால், canary-ஐ deploy செய்ய விரும்பினால், அல்லது staged rollout-ஐ செய்ய விரும்பினால் அவை பயனுள்ளதாக இருக்கும்.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx
  serviceName: "nginx"
  replicas: 3
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

### அதிகபட்சம் கிடைக்காத Pod-கள் (Maximum Unavailable Pods) {#maximum-unavailable-pods}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`.spec.updateStrategy.rollingUpdate.maxUnavailable` என்பது உருளும் புதுப்பிப்பு (rolling update) செயல்பாட்டின் போது கிடைக்காமல் (unavailable) இருக்கக்கூடிய Pod-களின் அதிகபட்ச எண்ணிக்கையை குறிப்பிடும் ஒரு விருப்பப் புலமாகும். மதிப்பு ஒரு முழு எண்ணாக (உதாரணம்: `5`) அல்லது விரும்பிய Pod-களின் சதவீதமாக (உதாரணம்: `10%`) இருக்கலாம். முழு எண்ணாக இருந்தால், கிடைக்காத Pod-களின் எண்ணிக்கை அந்த எண்ணாகும். சதவீதமாக இருந்தால், கிடைக்காத Pod-களின் எண்ணிக்கை மொத்த பிரதிகளின் (Replicas) சதவீதமாக கணக்கிடப்படும், கீழ்நோக்கி திட்டமிட்டு. இந்த புலம் 0 ஆக இருக்க முடியாது. இயல்புநிலை மதிப்பு `1` ஆகும்.

இந்த புலம் StatefulSet-இல் ஒரே நேரத்தில் புதுப்பிக்கப்படும் Pod-களின் மொத்த எண்ணிக்கையை குறிக்கிறது. தலைகீழ் வரிசை குறியீட்டில் (reverse ordinal order) புதுப்பிக்கப்படும் Pod-கள் `maxUnavailable` பிரதிகள் (replicas) எண்ணிக்கையை கொண்டிருக்கும். StatefulSet-இன் `.spec.updateStrategy.rollingUpdate.maxUnavailable` ஐ 1 ஐ விட அதிகமாக அமைக்கும்போது, 1 ஐ விட அதிகமான Pod-கள் ஒரே நேரத்தில் கிடைக்காமல் போகலாம்.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx
  serviceName: "nginx"
  replicas: 5
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

### கட்டாய பின்னோக்கி மாற்றம் (Forced Rollback) {#forced-rollback}

இயல்புநிலை [Pod Management Policy](#pod-management-policies) (`OrderedReady`) உடன் [Rolling Updates](#rolling-updates) பயன்படுத்தும்போது, கைமுறை தலையீடு தேவைப்படும் உடைந்த நிலைக்கு வருவது சாத்தியமாகும்.

Pod template-ஐ ஒருபோதும் Running மற்றும் Ready நிலைக்கு செல்லாத ஒரு கட்டமைப்பிற்கு புதுப்பித்தால் (உதாரணமாக, தவறான binary அல்லது application-நிலை கட்டமைப்பு பிழை காரணமாக), StatefulSet rollout-ஐ நிறுத்தி காத்திருக்கும்.

இந்த நிலையில், Pod template-ஐ மட்டும் சரியான கட்டமைப்பிற்கு திரும்ப மாற்றுவது போதாது. [அறியப்பட்ட ஒரு பிழையால்](https://github.com/kubernetes/kubernetes/issues/67250), StatefulSet முறிந்த Pod-ஐ Online-இல் கொண்டு வர முயற்சிக்கும், அது running மற்றும் ready என்று அறிவிக்கப்படும் வரை, அவ்வாறு running நிலைக்கு வந்தாலும் தவிர.

Template-ஐ மாற்றிய பிறகு, `partition`-ஐ கைமுறையாக மாற்றி முறிந்த Pod-ஐ மீண்டும் தொடங்க StatefulSet-ஐ வற்புறுத்த வேண்டும். இதுவும் template மாற்றத்துடன் rollback செய்யப்பட வேண்டும்.

## PersistentVolumeClaim வைத்திருக்கும் கொள்கை (PersistentVolumeClaim Retention) {#persistentvolumeclaim-retention}

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

`.spec.persistentVolumeClaimRetentionPolicy` புலம் (விருப்பமானது) StatefulSet வாழ்க்கைச் சுழற்சியில் PVC-கள் நீக்கப்படுமா என்பதை கட்டுப்படுத்துகிறது. இதை பயன்படுத்த `StatefulSetAutoDeletePVC` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)-ஐ இயக்க வேண்டும். இயக்கப்பட்டதும், ஒவ்வொரு StatefulSet-க்கும் இரண்டு கொள்கைகளை கட்டமைக்கலாம்:

`whenDeleted`
: StatefulSet நீக்கப்படும்போது பயன்படுத்தப்படும் தொகுதி (Volume) வைத்திருக்கும் நடத்தையை கட்டமைக்கிறது.

`whenScaled`
: StatefulSet-இன் பிரதிகளின் (Replicas) எண்ணிக்கை குறைக்கப்படும்போது, உதாரணமாக StatefulSet-ஐ அளவிடும் (scaling) போது பயன்படுத்தப்படும் தொகுதி வைத்திருக்கும் நடத்தையை கட்டமைக்கிறது.

ஒவ்வொரு கொள்கைக்கும் நீங்கள் `Delete` அல்லது `Retain` மதிப்புகளில் ஒன்றை அமைக்கலாம்:

`Delete`
: StatefulSet-ஐ பாதிக்கும் கொள்கையிலிருந்து PVC-கள் நீக்கப்படும். `whenDeleted` கொள்கையுடன், `volumeClaimTemplates`-ஆல் StatefulSet-க்கு வரையறுக்கப்பட்ட அனைத்து PVC-களும் StatefulSet நீக்கப்பட்டதும் நீக்கப்படும். `whenScaled` கொள்கையுடன், scale down செய்யப்படும் Pod-களுக்கு மட்டும் தொடர்புடைய PVC-கள் நீக்கப்படும்.

`Retain` (இயல்புநிலை)
: `volumeClaimTemplates`-ஆல் PVC-கள் StatefulSet நீக்கப்பட்டதும் அல்லது scale down செய்யப்பட்டதும் பாதிக்கப்படாது. StatefulSet-க்கான PVC-களை கைமுறையாக நீக்க வேண்டும்.

StatefulSet `.spec.persistentVolumeClaimRetentionPolicy` அமைப்பை கொண்ட ஒரு StatefulSet-இன் YAML உதாரணம்:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  serviceName: "mysql"
  replicas: 3
  persistentVolumeClaimRetentionPolicy:
    whenDeleted: Retain
    whenScaled: Delete
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 10Gi
```

`whenDeleted` அல்லது `whenScaled` எவ்வாறு செயல்படுகிறது என்று விரும்பினால், [PVC retention with StatefulSet](/docs/tasks/run-application/scale-stateful-set/#persistentvolumeclaim-retention) பார்க்கவும்.

## பிரதிகள் (Replicas) {#replicas}

`.spec.replicas` விரும்பிய Pod-களின் எண்ணிக்கையை குறிப்பிடும் ஒரு விருப்பப் புலமாகும். இயல்புநிலையாக இது `1` ஆகும்.

`kubectl scale` அல்லது `kubectl patch` போன்ற கட்டளைகளைப் பயன்படுத்தி StatefulSet-ஐ scale செய்யலாம்.

## {{% heading "whatsnext" %}}

* [StatefulSet-ஐப் பயன்படுத்தி Stateful பயன்பாட்டை இயக்குதல்](/docs/tutorials/stateful-application/basic-stateful-set/) என்ற tutorial-ஐப் பின்பற்றுங்கள்.
* [Cassandra-வை Stateful Sets-உடன் deploy செய்தல்](/docs/tutorials/stateful-application/cassandra/) என்ற tutorial-ஐப் பின்பற்றுங்கள்.
* [ZooKeeper-ஐ StatefulSet-உடன் இயக்குதல்](/docs/tutorials/stateful-application/zookeeper/) என்ற tutorial-ஐப் பின்பற்றுங்கள்.
* [StatefulSet-ஐ scale செய்தல்](/docs/tasks/run-application/scale-stateful-set/) பற்றிய விவரங்களுக்கு இந்த documentation-ஐ படிக்கவும்.
* [StatefulSet Pod-களை நீக்குதல்](/docs/tasks/run-application/force-delete-stateful-set-pod/) பற்றிய documentation-ஐ படிக்கவும்.
* [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) ஐப் பயன்படுத்தி disruptions-இன் போது கிடைக்கக்கூடிய அளவை நீங்கள் எவ்வாறு கட்டமைக்கலாம் என்று அறிக.
* [StatefulSet API reference](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/) ஐப் பார்க்கவும்.
