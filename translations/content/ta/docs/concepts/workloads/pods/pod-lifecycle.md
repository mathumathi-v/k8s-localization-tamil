---
title: Pod-களின் வாழ்க்கைச் சுழற்சி
content_type: concept
weight: 60
---

<!-- overview -->

Pod-கள் ஒரு குறிப்பிட்ட வாழ்க்கைச் சுழற்சியைப் பின்பற்றுகின்றன: Pending நிலையில் தொடங்கி, Running ஆகி, பின்னர் Succeeded அல்லது Failed நிலையை அடைகின்றன. Pod இயங்கும் போது, kubelet கொள்கலன்களின் (Container) வாழ்க்கைச் சுழற்சியையும் சோதனைகளையும் (Probe) நிர்வகிக்கிறது.

<!-- body -->

## Pod-ன் ஆயுள்காலம்

Pod-கள் தற்காலிகமானவை — அவை தாமே குணமாகும் திறன் கொண்டவை அல்ல. ஒரு Pod ஒரு Node-இல் இயங்கும்; அது நீக்கப்படும் வரை, வெளியேற்றப்படும் வரை, அல்லது Node தோல்வியடையும் வரை தொடர்ந்து இயங்கும்.

Pod-கள் நேரடியாக உருவாக்கப்படுவதில்லை — பொதுவாக Deployment, StatefulSet போன்ற workload வளங்கள் மூலம் நிர்வகிக்கப்படுகின்றன. இந்த கட்டுப்படுத்திகள் (controllers) Pod தோல்வியடைந்தால் புதிய Pod-களை தானாகவே உருவாக்கும்.

## Pod-களின் நிலைகள் (Phases)

ஒரு Pod-ன் `status` புலம் ஒரு `PodStatus` பொருளாகும், அதில் `phase` என்ற புலம் உள்ளது. சாத்தியமான நிலைகள்:

| நிலை | விளக்கம் |
|------|----------|
| `Pending` | Kubernetes �ால் ஏற்றுக்கொள்ளப்பட்டது, ஆனால் இன்னும் இயங்கவில்லை. படங்களை (Image) இழுக்கும் நேரமும் இதில் அடங்கும். |
| `Running` | ஒரு Node-உடன் இணைக்கப்பட்டுள்ளது; எல்லா கொள்கலன்களும் உருவாக்கப்பட்டுள்ளன, குறைந்தது ஒன்று இயங்குகிறது. |
| `Succeeded` | எல்லா கொள்கலன்களும் வெற்றிகரமாக முடிந்தன, மறுதொடக்கம் (Restart) செய்யப்படமாட்டாது. |
| `Failed` | எல்லா கொள்கலன்களும் முடிந்தன, குறைந்தது ஒன்று தோல்வியுடன் முடிந்தது. |
| `Unknown` | Pod-ன் நிலையை கண்டறிய முடியவில்லை, பொதுவாக Node தொடர்பு பிரச்சினையால். |

## கொள்கலன் நிலைகள் (Container States)

kubelet மூன்று கொள்கலன் நிலைகளை கண்காணிக்கிறது:

### Waiting
கொள்கலன் இன்னும் தேவையான செயல்பாடுகளை (Image இழுத்தல், secrets பயன்படுத்துதல்) முடிக்கவில்லை. `reason` புலம் காரணத்தை விளக்கும்.

### Running
கொள்கலன் எந்த பிரச்சினையும் இன்றி இயங்குகிறது. `startedAt` புலம் தொடங்கிய நேரத்தை குறிக்கும்.

### Terminated
கொள்கலன் இயக்கம் முடிந்தது — வெற்றியாகவோ தோல்வியாகவோ. `exitCode`, `startedAt`, `finishedAt` புலங்கள் விவரங்களை வழங்கும்.

## கொள்கலன் மறுதொடக்க கொள்கை (Restart Policy)

`spec.restartPolicy` புலம் மூன்று மதிப்புகளை ஆதரிக்கிறது:

- **`Always`** (இயல்புநிலை): கொள்கலன் முடிந்தவுடன் எப்போதும் மறுதொடக்கம் செய்யும்.
- **`OnFailure`**: தோல்வியுடன் (exit code != 0) முடிந்தால் மட்டும் மறுதொடக்கம் செய்யும்.
- **`Never`**: எந்த சூழ்நிலையிலும் மறுதொடக்கம் செய்யாது.

kubelet மறுதொடக்கத்திற்கு exponential back-off முறையைப் பயன்படுத்துகிறது: 10 வினாடி, 20 வினாடி, 40 வினாடி என அதிகரித்து, அதிகபட்சம் 5 நிமிடம் வரை காத்திருக்கும். கொள்கலன் 10 நிமிடம் வெற்றிகரமாக இயங்கினால் இந்த எண்ணிக்கை மீட்டமைக்கப்படும்.

## Pod நிலைமைகள் (Pod Conditions)

Pod-ன் `status.conditions` புலம் பின்வரும் நிலைமைகளை கொண்டிருக்கும்:

| நிலைமை | விளக்கம் |
|---------|----------|
| `PodScheduled` | Pod ஒரு Node-இல் திட்டமிடப்பட்டது. |
| `PodReadyToStartContainers` | Pod sandbox உருவாக்கப்பட்டு, networking கட்டமைக்கப்பட்டது. |
| `ContainersReady` | எல்லா கொள்கலன்களும் தயாராக உள்ளன. |
| `Initialized` | எல்லா init கொள்கலன்களும் வெற்றிகரமாக முடிந்தன. |
| `Ready` | Pod கோரிக்கைகளை ஏற்க தயாராக உள்ளது, Service endpoints-இல் சேர்க்கப்பட வேண்டும். |

## கொள்கலன் சோதனைகள் (Container Probes)

ஒரு சோதனை (Probe) என்பது kubelet-ஆல் கொள்கலனில் அவ்வப்போது செய்யப்படும் கண்டறிதல். நான்கு வகையான handlers உள்ளன:

- **`exec`**: கொள்கலனுக்குள் ஒரு கட்டளையை இயக்கும்; exit code 0 என்றால் வெற்றி.
- **`httpGet`**: HTTP GET கோரிக்கை அனுப்பும்; 200–399 நிலைக் குறியீடு வெற்றி.
- **`tcpSocket`**: TCP connection திறக்க முயலும்; திறந்தால் வெற்றி.
- **`grpc`**: gRPC health check செய்யும்; SERVING நிலை வெற்றி.

### சோதனை வகைகள்

#### livenessProbe
கொள்கலன் இயங்குகிறதா என்பதை சரிபார்க்கும். சோதனை தோல்வியடைந்தால், kubelet கொள்கலனை நிறுத்தி `restartPolicy` படி மறுதொடக்கம் செய்யும்.

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 3
  periodSeconds: 3
```

#### readinessProbe
கொள்கலன் கோரிக்கைகளை ஏற்க தயாரா என்பதை சரிபார்க்கும். சோதனை தோல்வியடைந்தால், Pod-ன் IP முகவரி Service endpoints-இலிருந்து நீக்கப்படும் — மறுதொடக்கம் செய்யப்படமாட்டாது.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

#### startupProbe
கொள்கலனுக்குள் உள்ள பயன்பாடு தொடங்கியதா என்பதை சரிபார்க்கும். இந்த சோதனை வெற்றியடையும் வரை மற்ற சோதனைகள் இயக்கப்படமாட்டாது. மெதுவாக தொடங்கும் கொள்கலன்களுக்கு பயனுள்ளது.

```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

### சோதனை முடிவுகள்

| முடிவு | விளக்கம் |
|--------|----------|
| `Success` | கொள்கலன் சோதனையில் தேர்ச்சி பெற்றது. |
| `Failure` | கொள்கலன் சோதனையில் தோல்வியடைந்தது. |
| `Unknown` | சோதனை தோல்வியடைந்தது, எந்த நடவடிக்கையும் எடுக்கப்படமாட்டாது. |

## Pod தயார்நிலை வாயில் (Readiness Gate)

கூடுதல் நிலைமைகளை Pod-ன் தயார்நிலையில் சேர்க்க `ReadinessGates` பயன்படுத்தலாம்:

```yaml
spec:
  readinessGates:
  - conditionType: "www.example.com/feature-1"
```

குறிப்பிட்ட `conditionType` `True` ஆகும் வரை Pod Ready ஆகாது.

## Pod நிறுத்தம் (Termination)

Pod நிறுத்தம் அழகான முறையில் (graceful) நடைபெறுகிறது:

1. பயனர் `kubectl delete pod` கட்டளையை இயக்குகிறார்.
2. Pod `Terminating` நிலைக்கு மாற்றப்படுகிறது; Service endpoints-இலிருந்து நீக்கப்படுகிறது.
3. `preStop` hook இருந்தால் அது இயக்கப்படுகிறது.
4. SIGTERM சமிக்கை கொள்கலனுக்கு அனுப்பப்படுகிறது.
5. `spec.terminationGracePeriodSeconds` (இயல்புநிலை: 30 வினாடி) காத்திருக்கும்.
6. கொள்கலன் இன்னும் இயங்கினால், SIGKILL அனுப்பப்படுகிறது.
7. API server Pod பொருளை நீக்கிவிடும்.

### திடீர் நீக்கம் (Forced Termination)

அவசர சூழ்நிலையில் grace period இல்லாமல் நீக்க:

```bash
kubectl delete pod <pod-name> --grace-period=0 --force
```

{{< warning >}}
திடீர் நீக்கம் தரவு இழப்பை ஏற்படுத்தலாம். அவசியமான போது மட்டுமே பயன்படுத்துக.
{{< /warning >}}

## தோல்வியுற்ற Pod-களின் குப்பை சேகரிப்பு (Garbage Collection)

PodGC controller முடிந்த Pod-களை நீக்கும். இயல்புநிலையில் 12,500 Pod-கள் வரம்பை மீறும்போது பழைய Pod-கள் நீக்கப்படும். பின்வரும் நிலைகளிலும் Pod-கள் நீக்கப்படலாம்:

- நீக்கப்பட்ட Node-இல் உள்ள Orphan Pod-கள்
- Unschedulable நிலையிலுள்ள முடிந்த Pod-கள்
- `terminationGracePeriodSeconds` முடிந்த Pod-கள்

## சுருக்கம்

Pod-களின் வாழ்க்கைச் சுழற்சியை புரிந்துகொள்வது Kubernetes கொத்தில் (Cluster) பயன்பாடுகளை நம்பகமாக இயக்க அவசியம். சரியான `restartPolicy`, தகுந்த சோதனைகள் (livenessProbe, readinessProbe, startupProbe), மற்றும் graceful termination ஆகியவை ஒரு நிலையான இயக்கத்திற்கு அடித்தளமாக அமைகின்றன.

## {{% heading "whatsnext" %}}

- [கொள்கலன் lifecycle events-உடன் handlers இணைத்தல்](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/) பற்றி நடைமுறையில் கற்க.
- [Liveness, Readiness மற்றும் Startup Probes-ஐ கட்டமைத்தல்](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) பற்றி நடைமுறையில் கற்க.
- [கொள்கலன் lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/) பற்றி மேலும் அறிக.
