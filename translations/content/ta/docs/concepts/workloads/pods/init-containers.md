---
reviewers:
- erictune
title: Init கொள்கலன்கள்
content_type: concept
weight: 40
---

<!-- overview -->
இந்தப் பக்கம் init கொள்கலன்களைப் (init containers) பற்றிய கண்ணோட்டத்தை வழங்குகிறது: இவை ஒரு {{< glossary_tooltip text="Pod" term_id="pod" >}}-இல் பயன்பாட்டு கொள்கலன்களுக்கு முன்பே இயங்கும் சிறப்பு நோக்க கொள்கலன்கள். பயன்பாட்டு படத்தில் (image) இல்லாத கருவிகள் அல்லது அமைவு நிரல்களை init கொள்கலன்கள் கொண்டிருக்கலாம்.

Pod விவரக்குறிப்பில் (specification) `containers` வரிசையுடன் (பயன்பாட்டு கொள்கலன்களை விவரிக்கும்) சேர்த்து init கொள்கலன்களையும் குறிப்பிடலாம்.

Kubernetes-இல், ஒரு [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/) என்பது முதன்மை பயன்பாட்டு கொள்கலனுக்கு முன்பே தொடங்கி _தொடர்ந்து இயங்கும்_ ஒரு கொள்கலனாகும். இந்த ஆவணம் init கொள்கலன்களைப் பற்றியது: Pod தொடக்கத்தின் (initialization) போது நிறைவடையும் வரை இயங்கும் கொள்கலன்கள்.

<!-- body -->

## Init கொள்கலன்களைப் புரிந்துகொள்ளுதல்

ஒரு {{< glossary_tooltip text="Pod" term_id="pod" >}}-இல் பல பயன்பாட்டு கொள்கலன்கள் இயங்கலாம், ஆனால் பயன்பாட்டு கொள்கலன்கள் தொடங்குவதற்கு முன்பே இயங்கும் ஒன்று அல்லது அதற்கு மேற்பட்ட init கொள்கலன்களையும் கொண்டிருக்கலாம்.

Init கொள்கலன்கள் சாதாரண கொள்கலன்களைப் போலவே இருக்கும், தவிர:

* Init கொள்கலன்கள் எப்போதும் நிறைவடையும் வரை இயங்கும்.
* ஒவ்வொரு init கொள்கலனும் அடுத்தது தொடங்குவதற்கு முன்பு வெற்றிகரமாக நிறைவடைந்திருக்க வேண்டும்.

ஒரு Pod-இன் init கொள்கலன் தோல்வியடைந்தால், kubelet அந்த init கொள்கலனை வெற்றிகரமாக முடியும் வரை மீண்டும் மீண்டும் தொடங்கும். எனினும், Pod-இன் `restartPolicy` `Never` என்று இருந்து, அந்த Pod தொடக்கத்தின் போது ஒரு init கொள்கலன் தோல்வியடைந்தால், Kubernetes முழு Pod-ஐயும் தோல்வியடைந்ததாகக் கருதும்.

ஒரு Pod-க்கான init கொள்கலனை குறிப்பிட, [Pod விவரக்குறிப்பில்](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) `initContainers` புலத்தை `container` உருப்படிகளின் வரிசையாக (பயன்பாட்டு `containers` புலத்திற்கும் அதன் உள்ளடக்கங்களுக்கும் ஒத்த வகையில்) சேர்க்கவும். API குறிப்பில் [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)-ஐப் பாருங்கள்.

Init கொள்கலன்களின் நிலை `.status.initContainerStatuses` புலத்தில் கொள்கலன் நிலைகளின் வரிசையாகத் திருமுகப்படுத்தப்படும் (`.status.containerStatuses` புலத்திற்கு ஒத்த வகையில்).

### சாதாரண கொள்கலன்களிடமிருந்து வேறுபாடுகள்

Init கொள்கலன்கள் வள (resource) வரம்புகள், [தொகுதிகள் (volumes)](/docs/concepts/storage/volumes/) மற்றும் பாதுகாப்பு அமைப்புகள் உட்பட பயன்பாட்டு கொள்கலன்களின் அனைத்து புலங்களையும் அம்சங்களையும் ஆதரிக்கின்றன. எனினும், ஒரு init கொள்கலனுக்கான வள கோரிக்கைகள் மற்றும் வரம்புகள் வித்தியாசமாக கையாளப்படுகின்றன, இது [கொள்கலன்களுக்குள் வள பகிர்வு](#resource-sharing-within-containers)-இல் ஆவணப்படுத்தப்பட்டுள்ளது.

சாதாரண init கொள்கலன்கள் (வேறுவிதமாக கூறுவதானால்: sidecar கொள்கலன்களை தவிர்த்து) `lifecycle`, `livenessProbe`, `readinessProbe` அல்லது `startupProbe` புலங்களை ஆதரிக்கவில்லை. Init கொள்கலன்கள் Pod தயார் நிலைக்கு (ready) முன்பே நிறைவடைந்திருக்க வேண்டும்; sidecar கொள்கலன்கள் Pod-இன் வாழ்நாள் முழுவதும் தொடர்ந்து இயங்கும், மேலும் சில probe-களை ஆதரிக்கும். sidecar கொள்கலன்களைப் பற்றிய கூடுதல் விவரங்களுக்கு [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/)-ஐப் பாருங்கள்.

ஒரு Pod-க்கு பல init கொள்கலன்களை குறிப்பிட்டால், kubelet ஒவ்வொரு init கொள்கலனையும் வரிசையாக இயக்கும். ஒவ்வொரு init கொள்கலனும் அடுத்தது இயங்குவதற்கு முன்பு வெற்றிகரமாக முடிந்திருக்க வேண்டும். எல்லா init கொள்கலன்களும் நிறைவடைந்தவுடன், kubelet அந்த Pod-க்கான பயன்பாட்டு கொள்கலன்களை தொடங்கி வழக்கம்போல் இயக்கும்.

### Sidecar கொள்கலன்களிலிருந்து வேறுபாடுகள்

Init கொள்கலன்கள் முதன்மை பயன்பாட்டு கொள்கலன் தொடங்குவதற்கு முன்பே தங்கள் பணிகளை இயக்கி நிறைவடைகின்றன. [Sidecar கொள்கலன்களைப்](/docs/concepts/workloads/pods/sidecar-containers) போல் அல்லாமல், init கொள்கலன்கள் முதன்மை கொள்கலன்களுடன் இணையாக தொடர்ந்து இயங்குவதில்லை.

Init கொள்கலன்கள் வரிசையாக நிறைவடையும் வரை இயங்கும், மேலும் எல்லா init கொள்கலன்களும் வெற்றிகரமாக நிறைவடையும் வரை முதன்மை கொள்கலன் தொடங்காது.

Init கொள்கலன்கள் `lifecycle`, `livenessProbe`, `readinessProbe` அல்லது `startupProbe`-ஐ ஆதரிக்கவில்லை, அதே நேரத்தில் sidecar கொள்கலன்கள் தங்கள் வாழ்நாளை கட்டுப்படுத்த இந்த எல்லா [probe-களையும்](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe) ஆதரிக்கின்றன.

Init கொள்கலன்கள் முதன்மை பயன்பாட்டு கொள்கலன்களுடன் அதே வளங்களை (CPU, memory, network) பகிர்ந்துகொள்கின்றன, ஆனால் அவற்றுடன் நேரடியாக தொடர்பு கொள்வதில்லை. எனினும், தரவு பரிமாற்றத்திற்காக பகிரப்பட்ட தொகுதிகளை (volumes) பயன்படுத்தலாம்.

## Init கொள்கலன்களைப் பயன்படுத்துதல்

Init கொள்கலன்களுக்கு பயன்பாட்டு கொள்கலன்களிலிருந்து வேறுபட்ட படங்கள் (images) இருப்பதால், தொடக்கம்-சம்பந்தமான குறியீட்டிற்கு சில நன்மைகள் உள்ளன:

* பயன்பாட்டு படத்தில் (image) இல்லாத அமைவிற்கான கருவிகள் அல்லது தனிப்பயன் குறியீட்டை init கொள்கலன்கள் கொண்டிருக்கலாம். எடுத்துக்காட்டாக, அமைவின் போது `sed`, `awk`, `python` அல்லது `dig` போன்ற கருவியைப் பயன்படுத்துவதற்காக மட்டுமே மற்றொரு படத்திலிருந்து `FROM` செய்து ஒரு படத்தை உருவாக்க வேண்டியதில்லை.
* பயன்பாட்டு படம் கட்டுபவர் மற்றும் வரிசைப்படுத்துபவர் பாத்திரங்கள் ஒரே பயன்பாட்டு படத்தை இணைந்து கட்டாமல் சுதந்திரமாக வேலை செய்யலாம்.
* Init கொள்கலன்கள் அதே Pod-இல் உள்ள பயன்பாட்டு கொள்கலன்களைவிட வேறான கோப்பு முறைமை பார்வையுடன் இயங்கலாம். இதன் விளைவாக, பயன்பாட்டு கொள்கலன்களால் அணுக முடியாத {{< glossary_tooltip text="Secrets" term_id="secret" >}}-களை அணுகும் அனுமதி அவற்றுக்கு கொடுக்கலாம்.
* Init கொள்கலன்கள் எந்த பயன்பாட்டு கொள்கலனும் தொடங்குவதற்கு முன்பே நிறைவடைவதால், ஒரு தொகுப்பு முன்நிபந்தனைகள் பூர்த்தியாகும் வரை பயன்பாட்டு கொள்கலன் தொடக்கத்தை தடுக்க அல்லது தாமதப்படுத்த ஒரு வழிமுறையை வழங்குகின்றன. முன்நிபந்தனைகள் பூர்த்தியானவுடன், ஒரு Pod-இல் உள்ள அனைத்து பயன்பாட்டு கொள்கலன்களும் இணையாக தொடங்கலாம்.
* Init கொள்கலன்கள் அல்லாமல் இருந்தால் பயன்பாட்டு கொள்கலன் படத்தை குறைவான பாதுகாப்பாக ஆக்கக்கூடிய கருவிகள் அல்லது தனிப்பயன் குறியீட்டை பாதுகாப்பாக இயக்கலாம். தேவையற்ற கருவிகளை தனியாக வைப்பதன் மூலம் உங்கள் பயன்பாட்டு கொள்கலன் படத்தின் தாக்குதல் மேற்பரப்பை குறைக்கலாம்.

### எடுத்துக்காட்டுகள்

Init கொள்கலன்களை எவ்வாறு பயன்படுத்துவது என்பதற்கான சில யோசனைகள்:

* ஒரு {{< glossary_tooltip text="Service" term_id="service">}} உருவாக்கப்படும் வரை காத்திருக்க, இதுபோன்ற ஒரு வரி shell கட்டளையைப் பயன்படுத்துதல்:
  ```shell
  for i in {1..100}; do sleep 1; if nslookup myservice; then exit 0; fi; done; exit 1
  ```

* downward API-ஐப் பயன்படுத்தி இந்த Pod-ஐ தொலை சேவையகத்தில் பதிவு செய்ய இதுபோன்ற கட்டளையைப் பயன்படுத்துதல்:
  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

* பயன்பாட்டு கொள்கலனை தொடங்குவதற்கு முன்பு சிறிது நேரம் காத்திருக்க இதுபோன்ற கட்டளையைப் பயன்படுத்துதல்:
  ```shell
  sleep 60
  ```

* ஒரு Git களஞ்சியத்தை (repository) ஒரு {{< glossary_tooltip text="தொகுதியில் (Volume)" term_id="volume" >}} குளோன் செய்தல்

* முதன்மை பயன்பாட்டு கொள்கலனுக்கான கட்டமைப்பு கோப்பை மாறும் வகையில் உருவாக்க ஒரு மதிப்பை கட்டமைப்பு கோப்பில் வைத்து ஒரு template கருவியை இயக்குதல். எடுத்துக்காட்டாக, கட்டமைப்பில் `POD_IP` மதிப்பை வைத்து Jinja மூலம் முதன்மை பயன்பாட்டு கட்டமைப்பு கோப்பை உருவாக்குதல்.

#### பயன்பாட்டில் Init கொள்கலன்கள்

இந்த எடுத்துக்காட்டு இரண்டு init கொள்கலன்களைக் கொண்ட ஒரு எளிய Pod-ஐ வரையறுக்கிறது. முதல் init கொள்கலன் `myservice`-க்காக காத்திருக்கிறது, இரண்டாவது `mydb`-க்காக காத்திருக்கிறது. இரண்டு init கொள்கலன்களும் நிறைவடைந்தவுடன், Pod அதன் `spec` பகுதியிலிருந்து பயன்பாட்டு கொள்கலனை இயக்கும்.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app.kubernetes.io/name: MyApp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

இந்த Pod-ஐ தொடங்க, பின்வரும் கட்டளையை இயக்கவும்:

```shell
kubectl apply -f myapp.yaml
```
வெளியீடு இதற்கு ஒத்ததாக இருக்கும்:
```
pod/myapp-pod created
```

அதன் நிலையை சரிபார்க்க:
```shell
kubectl get -f myapp.yaml
```
வெளியீடு இதற்கு ஒத்ததாக இருக்கும்:
```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

அல்லது கூடுதல் விவரங்களுக்கு:
```shell
kubectl describe -f myapp.yaml
```
வெளியீடு இதற்கு ஒத்ததாக இருக்கும்:
```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app.kubernetes.io/name=MyApp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container init-myservice
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container init-myservice
```

இந்த Pod-இல் உள்ள init கொள்கலன்களின் பதிவுகளை (logs) பார்க்க:
```shell
kubectl logs myapp-pod -c init-myservice # முதல் init கொள்கலனை ஆய்வு செய்க
kubectl logs myapp-pod -c init-mydb      # இரண்டாவது init கொள்கலனை ஆய்வு செய்க
```

இந்த நேரத்தில், அந்த init கொள்கலன்கள் `mydb` மற்றும் `myservice` என்று பெயரிடப்பட்ட {{< glossary_tooltip text="Services" term_id="service" >}}-களை கண்டுபிடிக்க காத்திருக்கும்.

அந்த Services-களை தோற்றுவிக்க பயன்படுத்தக்கூடிய கட்டமைப்பு இங்கே:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

`mydb` மற்றும் `myservice` சேவைகளை உருவாக்க:

```shell
kubectl apply -f services.yaml
```
வெளியீடு இதற்கு ஒத்ததாக இருக்கும்:
```
service/myservice created
service/mydb created
```

அந்த init கொள்கலன்கள் நிறைவடைந்து `myapp-pod` Pod Running நிலைக்கு மாறுவதை நீங்கள் பார்ப்பீர்கள்:

```shell
kubectl get -f myapp.yaml
```
வெளியீடு இதற்கு ஒத்ததாக இருக்கும்:
```
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

இந்த எளிய எடுத்துக்காட்டு உங்கள் சொந்த init கொள்கலன்களை உருவாக்க உங்களுக்கு சில நுண்ணறிவு வழங்க வேண்டும். [அடுத்தது என்ன](#what-s-next)-இல் மேலும் விரிவான எடுத்துக்காட்டிற்கான இணைப்பு உள்ளது.

## விரிவான நடத்தை

Pod தொடக்கத்தின் போது, networking மற்றும் storage தயார் ஆகும் வரை kubelet init கொள்கலன்களை இயக்குவதை தாமதப்படுத்துகிறது. பின்னர் kubelet Pod-இன் spec-இல் தோன்றும் வரிசையில் Pod-இன் init கொள்கலன்களை இயக்குகிறது.

ஒவ்வொரு init கொள்கலனும் அடுத்தது தொடங்குவதற்கு முன்பு வெற்றிகரமாக வெளியேற வேண்டும். ஒரு கொள்கலன் runtime காரணமாக தொடங்கத் தவறினாலோ அல்லது தோல்வியுடன் வெளியேறினாலோ, Pod `restartPolicy`-ன் படி மீண்டும் முயற்சிக்கப்படும். எனினும், Pod `restartPolicy` Always என்று அமைக்கப்பட்டிருந்தால், init கொள்கலன்கள் `restartPolicy` OnFailure-ஐப் பயன்படுத்துகின்றன.

எல்லா init கொள்கலன்களும் வெற்றிகரமாக முடியும் வரை Pod `Ready` நிலையில் இருக்க முடியாது. ஒரு init கொள்கலனில் உள்ள ports ஒரு Service-இன் கீழ் தொகுக்கப்படுவதில்லை. தொடக்க நிலையில் இருக்கும் ஒரு Pod `Pending` நிலையில் இருக்கும் ஆனால் `Initialized` நிபந்தனை false என்று அமைக்கப்பட்டிருக்கும்.

Pod [மறுதொடக்கம்](#pod-restart-reasons) செய்யப்பட்டால் அல்லது மீண்டும் தொடங்கினால், எல்லா init கொள்கலன்களும் மீண்டும் இயக்கப்பட வேண்டும்.

Init கொள்கலன் spec-இல் மாற்றங்கள் கொள்கலன் படம் (image) புலத்திற்கு மட்டுமே வரம்பிடப்பட்டுள்ளன. ஒரு init கொள்கலனின் `image` புலத்தை நேரடியாக மாற்றுவது Pod-ஐ மறுதொடக்கம் செய்வதில்லை அல்லது அதை மறுவுருவாக்கத்தை தூண்டுவதில்லை. Pod இன்னும் தொடங்காவிட்டால், அந்த மாற்றம் Pod எவ்வாறு துவங்குகிறது என்பதில் தாக்கம் ஏற்படுத்தலாம்.

ஒரு [pod template](/docs/concepts/workloads/pods/#pod-templates)-க்கு நீங்கள் பொதுவாக ஒரு init கொள்கலனுக்கான எந்த புலத்தையும் மாற்றலாம்; அந்த மாற்றத்தின் தாக்கம் pod template எங்கே பயன்படுத்தப்படுகிறது என்பதைப் பொறுத்தது.

Init கொள்கலன்கள் மறுதொடக்கம் செய்யப்படலாம், மீண்டும் முயற்சிக்கப்படலாம் அல்லது மீண்டும் இயக்கப்படலாம் என்பதால், init கொள்கலன் குறியீடு idempotent ஆக (ஒரே முடிவை மீண்டும் மீண்டும் செயல்படுத்தினாலும் கொடுக்கும் வகையில்) இருக்க வேண்டும். குறிப்பாக, எந்த `emptyDir` தொகுதியிலும் (volume) எழுதும் குறியீடு வெளியீட்டு கோப்பு ஏற்கனவே இருக்கும் சாத்தியத்திற்கு தயாராக இருக்க வேண்டும்.

Init கொள்கலன்களுக்கு ஒரு பயன்பாட்டு கொள்கலனின் எல்லா புலங்களும் உள்ளன. எனினும், Kubernetes `readinessProbe`-ஐ பயன்படுத்துவதை தடைசெய்கிறது, ஏனென்றால் init கொள்கலன்களால் நிறைவிலிருந்து வேறுபட்ட தயர் நிலையை வரையறுக்க முடியாது. இது சரிபார்ப்பின் போது நடைமுறைப்படுத்தப்படுகிறது.

Init கொள்கலன்கள் என்றென்றும் தோல்வியடைவதை தடுக்க Pod-இல் `activeDeadlineSeconds`-ஐப் பயன்படுத்துங்கள். செயல்படும் காலக்கெடு init கொள்கலன்களை உள்ளடக்கியது. எனினும் `activeDeadlineSeconds`-ஐ குழுக்கள் தங்கள் பயன்பாட்டை Job ஆக வரிசைப்படுத்தினால் மட்டுமே பயன்படுத்த பரிந்துரைக்கப்படுகிறது, ஏனென்றால் initContainer முடிந்த பிறகும் `activeDeadlineSeconds` தாக்கம் ஏற்படுத்துகிறது. ஏற்கனவே சரியாக இயங்கும் Pod ஐ நீங்கள் `activeDeadlineSeconds` அமைத்தால் அது நிறுத்தப்படும்.

ஒரு Pod-இல் உள்ள ஒவ்வொரு பயன்பாடு மற்றும் init கொள்கலன் பெயரும் தனித்துவமாக இருக்க வேண்டும்; வேறொரு கொள்கலனுடன் பெயரை பகிரும் எந்த கொள்கலனுக்கும் சரிபார்ப்பு பிழை தூக்கி எறியப்படும்.

### கொள்கலன்களுக்குள் வள பகிர்வு {#resource-sharing-within-containers}

init, sidecar மற்றும் பயன்பாட்டு கொள்கலன்களின் இயக்க வரிசையை கொண்டு, வள பயன்பாட்டிற்கான பின்வரும் விதிகள் பொருந்தும்:

* எல்லா init கொள்கலன்களிலும் வரையறுக்கப்பட்ட எந்த குறிப்பிட்ட வள கோரிக்கை அல்லது வரம்பிலும் மிக உயர்ந்தது *effective init request/limit* ஆகும். எந்த வளத்திற்கும் வள வரம்பு குறிப்பிடப்படாவிட்டால் இது மிக உயர்ந்த வரம்பாக கருதப்படும்.
* ஒரு வளத்திற்கான Pod-இன் *effective request/limit* பின்வருவனவற்றில் எது அதிகமோ அது:
  * ஒரு வளத்திற்கான எல்லா பயன்பாட்டு கொள்கலன்களின் request/limit-இன் தொகை
  * ஒரு வளத்திற்கான effective init request/limit
* திட்டமிடல் (Scheduling) effective requests/limits-இன் அடிப்படையில் செய்யப்படுகிறது, அதாவது init கொள்கலன்கள் Pod-இன் வாழ்நாளில் பயன்படுத்தப்படாத தொடக்கத்திற்கான வளங்களை ஒதுக்கி வைக்கலாம்.
* Pod-இன் *effective QoS tier* (சேவை தர நிலை) என்பது init கொள்கலன்கள் மற்றும் பயன்பாட்டு கொள்கலன்கள் இரண்டிற்கும் சேர்த்த QoS (quality of service) நிலையாகும்.

ஒதுக்கீடு மற்றும் வரம்புகள் effective Pod request மற்றும் limit-இன் அடிப்படையில் பயன்படுத்தப்படுகின்றன.

### Init கொள்கலன்கள் மற்றும் Linux cgroups {#cgroups}

Linux-இல், Pod நிலை கட்டுப்பாட்டு குழுக்களுக்கான (cgroups) வள ஒதுக்கீடுகள் scheduler போலவே effective Pod request மற்றும் limit-இன் அடிப்படையில் அமைக்கப்படுகின்றன.

{{< comment >}}
This section also present under [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) page.
If you're editing this section, change both places.
{{< /comment >}}

### Pod மறுதொடக்கம் காரணங்கள் {#pod-restart-reasons}

ஒரு Pod பின்வரும் காரணங்களுக்காக மறுதொடக்கம் செய்யப்படலாம், இதனால் init கொள்கலன்கள் மீண்டும் இயக்கப்படும்:

* Pod உள்கட்டமைப்பு கொள்கலன் மறுதொடக்கம் செய்யப்படுகிறது. இது அரிதானது மற்றும் nodes-இல் root அணுகல் உள்ளவர்களால் மட்டுமே செய்யப்படும்.
* `restartPolicy` Always என்று அமைக்கப்பட்டிருக்கும் போது ஒரு Pod-இல் உள்ள எல்லா கொள்கலன்களும் நிறுத்தப்பட்டு, மறுதொடக்கம் கட்டாயப்படுத்தப்பட்டு, {{< glossary_tooltip text="garbage collection" term_id="garbage-collection" >}} காரணமாக init கொள்கலன் நிறைவு பதிவு இழக்கப்பட்டது.

Init கொள்கலன் படம் (image) மாற்றப்படும் போது அல்லது garbage collection காரணமாக init கொள்கலன் நிறைவு பதிவு இழக்கப்படும் போது Pod மறுதொடக்கம் செய்யப்படமாட்டாது. இது Kubernetes v1.20 மற்றும் அதற்குப் பிறகான பதிப்புகளுக்கு பொருந்தும். Kubernetes-இன் முந்தைய பதிப்பை நீங்கள் பயன்படுத்துகிறீர்களென்றால், நீங்கள் பயன்படுத்தும் பதிப்பிற்கான ஆவணத்தைப் பாருங்கள்.

## {{% heading "whatsnext" %}}

பின்வருவனவற்றைப் பற்றி மேலும் அறிக:
* [Init கொள்கலன் கொண்ட Pod உருவாக்குதல்](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* [Init கொள்கலன்களை debug செய்தல்](/docs/tasks/debug/debug-application/debug-init-containers/).
* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) மற்றும் [kubectl](/docs/reference/kubectl/) பற்றிய கண்ணோட்டம்.
* [Probe வகைகள்](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup probe.
* [Sidecar கொள்கலன்கள்](/docs/concepts/workloads/pods/sidecar-containers).
