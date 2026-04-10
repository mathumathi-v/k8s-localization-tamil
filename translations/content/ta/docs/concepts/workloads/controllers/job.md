---
title: Job-கள்
api_metadata:
- apiVersion: "batch/v1"
  kind: "Job"
content_type: concept
description: >-
  Job-கள் முடிவடையும் வரை இயங்கும் ஒரு முறை பணிகளை குறிக்கின்றன, பிறகு நிறுத்தப்படும்.
weight: 50
hide_summary: true
---

<!-- overview -->

ஒரு Job என்பது ஒன்று அல்லது அதிகமான Pod-களை உருவாக்கி, குறிப்பிட்ட எண்ணிக்கையிலான Pod-கள் வெற்றிகரமாக முடிவடையும் வரை இயக்கத்தை மீண்டும் மீண்டும் முயற்சிக்கும். Pod-கள் வெற்றிகரமாக முடிவடையும்போது, Job வெற்றிகரமான முடிவுகளை கண்காணிக்கிறது. குறிப்பிட்ட எண்ணிக்கையிலான வெற்றிகரமான முடிவுகள் அடையப்படும்போது, பணி (Task) முடிவடைகிறது.

<!-- body -->

## கண்ணோட்டம் {#overview}

ஒரு Job, ஒன்று அல்லது அதிகமான Pod-களை உருவாக்கி, குறிப்பிட்ட எண்ணிக்கையிலான Pod-கள் வெற்றிகரமாக முடிவடையும் வரை இயக்கத்தை தொடர்ந்து முயற்சிக்கும். Pod-கள் வெற்றிகரமாக முடிவடையும்போது, Job வெற்றிகரமான முடிவுகளை கண்காணிக்கிறது. குறிப்பிட்ட எண்ணிக்கையிலான வெற்றிகரமான முடிவுகள் அடையப்படும்போது, பணி முழுமையடைகிறது. ஒரு Job-ஐ நீக்குவது (Deleting) அது உருவாக்கிய Pod-களையும் சுத்தம் செய்யும். ஒரு Job-ஐ இடைநிறுத்துவது (Suspending) அதன் செயலில் உள்ள Pod-களை மீண்டும் தொடங்கும் வரை நீக்கும்.

ஒரு எளிய வழக்கு என்னவெனில், ஒரு Pod-ஐ நம்பகமான முறையில் முடிவிற்கு இயக்க ஒரு Job உருவாக்குவது. முதல் Pod தோல்வியடைந்தால் அல்லது நீக்கப்பட்டால், Job புதிய Pod-ஐ தொடங்கும். பல Pod-களை இணையாக இயக்கவும் (Parallel) Job-ஐ பயன்படுத்தலாம். ஒரு திட்டமிட்ட அட்டவணையில் (Schedule) Job-ஐ இயக்க விரும்பினால், CronJob-ஐப் பாருங்கள்.

## ஒரு உதாரண Job-ஐ இயக்குதல் {#running-an-example-job}

கீழே ஒரு Job-இன் உதாரண உள்ளமைவு (Configuration) உள்ளது. இது π-ஐ 2000 இலக்கங்கள் வரை கணக்கிட்டு அதை அச்சிடுகிறது. முடிவடைவதற்கு சுமார் 10 விநாடிகள் ஆகும்.

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```

இந்த கட்டளை Job-ஐ உருவாக்கும். Job நிலையை சரிபார்க்க:

```shell
# நிலையை சரிபார்க்க
kubectl describe jobs/pi
```

```shell
# Job-ஆல் உருவாக்கப்பட்ட Pod-களைப் பாருங்கள்
pods=$(kubectl get pods --selector=job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```

```shell
# Pod-இன் பதிவுகளைப் (Logs) பாருங்கள்
kubectl logs $pods
```

வெளியீடு (Output) π-இன் கணக்கீட்டு முடிவைக் காட்டும்.

## Job-களுக்கான இணை இயக்கம் {#parallel-execution-for-jobs}

Job-ஐ பயன்படுத்தி இணையாக பல Pod-களை இயக்க மூன்று முக்கிய வகைகள் உள்ளன:

1. **இணை அல்லாத Job-கள் (Non-parallel Jobs)**: இயல்பாக, ஒரு Pod மட்டுமே தொடங்கப்படும், Pod தோல்வியடைந்தால் மட்டுமே புதிய Pod தொடங்கும். Pod வெற்றிகரமாக முடிவடையும்போது Job முடிவடைகிறது.

2. **நிர்ணயிக்கப்பட்ட முடிவு எண்ணிக்கையுடன் இணை Job-கள் (Parallel Jobs with fixed completion count)**: `.spec.completions` புலத்தில் ஒரு நேர்மறை மதிப்பை குறிப்பிடவும். Job ஒட்டுமொத்த பணியை குறிக்கிறது, மேலும் 1 முதல் `.spec.completions` வரையிலான ஒவ்வொரு மதிப்பிற்கும் ஒரு வெற்றிகரமான Pod இருக்கும்போது முடிவடைகிறது.

3. **பணி வரிசையுடன் இணை Job-கள் (Parallel Jobs with a work queue)**: `.spec.parallelism` புலத்தை குறிப்பிடவும், `.spec.completions` குறிப்பிடாமல். ஒவ்வொரு Pod-ம் தன்னிச்சையாக பணி வரிசையிலிருந்து பணிகளை எடுத்து செயலாக்கும். பணி வரிசை காலியாகும்போது, ஒரு Pod வெற்றிகரமாக முடிவடையும்போது Job முடிவடைகிறது.

### இணை இயக்கத்தை கட்டுப்படுத்துதல் {#controlling-parallelism}

கோரப்பட்ட இணையம் (`.spec.parallelism`) எந்த நேர்மறை மதிப்பாகவும் இருக்கலாம். 0 எனக் குறிப்பிட்டால், Job நிறுத்தப்படும். உண்மையான இணையம் சில நேரங்களில் கோரப்பட்டதை விட குறைவாக இருக்கலாம்:

- நிர்ணயிக்கப்பட்ட முடிவு எண்ணிக்கை உள்ள Job-களுக்கு, இணையாக இயங்கும் உண்மையான Pod எண்ணிக்கை மீதமுள்ள முடிவுகளை மீறாது.
- பணி வரிசை Job-களுக்கு, ஒரு Pod வெற்றிகரமாக முடிவடைந்த பின் புதிய Pod-கள் தொடங்காது.
- Job கட்டுப்படுத்தி (Controller) உருவாக்க நேரமெடுக்கலாம்.
- Job-ஐ விட அதிக தோல்விகள் இருந்தால் அது Pod உருவாக்கத்தை குறைக்கலாம்.
- ஒரு Pod நட்சத்திரமாக முடிவடைந்தால், வேலை செய்யாத Node-ஐ நீக்கும் போது.

### முடிவு முறை (Completion Mode) {#completion-mode}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`.spec.completionMode` புலம் வழியாக Job-கள் இரண்டு முடிவு முறைகளில் வரையறுக்கப்படலாம்:

- **`NonIndexed`** (இயல்புநிலை): Job-ல் `.spec.completions` வெற்றிகரமான Pod-கள் இருக்கும்போது முடிவடைகிறது. வேறு வார்த்தைகளில், ஒவ்வொரு Pod-ம் ஒன்றோடொன்று மாற்றிடத்தக்கவை. `.spec.completions` குறிப்பிடப்படாத Job-களும் `NonIndexed` ஆக கருதப்படுகின்றன.

- **`Indexed`**: Job-இன் Pod-கள் 0 முதல் `.spec.completions-1` வரையிலான எண் குறியீட்டினை (Index) பெறுகின்றன. Job ஒவ்வொரு குறியீட்டிற்கும் ஒரு வெற்றிகரமான Pod இருக்கும்போது முடிவடைகிறது. குறியீட்டு மதிப்பு கீழ்க்கண்ட இடங்களில் கிடைக்கும்:
  - Pod annotation `batch.kubernetes.io/job-completion-index`
  - Pod hostname-ல் `$(job-name)-$(index)` என்ற வடிவில்
  - கொள்கலனில் (Container) `JOB_COMPLETION_INDEX` சூழல் மாறியில் (Environment Variable)

## Pod மற்றும் கொள்கலன் தோல்விகளை கையாளுதல் {#handling-pod-and-container-failures}

Pod-இல் உள்ள கொள்கலன் சூன்ய அல்லாத வெளியேறும் குறியீட்டுடன் (Exit Code) வெளியேறலாம் அல்லது Pod-ஐ கொண்ட Node நீக்கப்படலாம். Job அதன் `spec`-ல் குறிப்பிட்டுள்ள வெற்றி வரம்பை அடையும் வரை புதிய Pod-களை உருவாக்கும்.

### Pod பின்னோக்கு தோல்வி கொள்கை (Pod backoff failure policy) {#pod-backoff-failure-policy}

சில நேரங்களில் யுக்திப்பிழை (Logic Error) போன்ற காரணங்களால் Job தொடர்ந்து மீண்டும் முயற்சிக்காமல் தோல்வியடையும்படி செய்யலாம். இதை `.spec.backoffLimit` புலத்தில் Job-ஐ தோல்வியாகக் கருதுவதற்கு முன் மீண்டும் முயற்சிக்கும் எண்ணிக்கையை குறிப்பிட்டு நிர்வகிக்கலாம். இயல்புநிலை மதிப்பு 6 ஆகும்.

Job-உடன் தொடர்புடைய தோல்வியடைந்த Pod-கள் Job கட்டுப்படுத்தியால் மீண்டும் உருவாக்கப்படும், ஆனால் அதிகரிக்கும் பின்னோக்கு தாமதத்துடன் (10 வினாடிகள், 20 வினாடிகள், 40 வினாடிகள், 6 நிமிடங்கள் வரை). அந்த Job-க்கான புதிய Pod தோல்வியடைவதற்கு முன் 10 நிமிடங்கள் வெற்றிகரமாக இயங்கியிருந்தால் இந்த பின்னோக்கு தாமத எண்ணிக்கை மீட்டமைக்கப்படும்.

### Pod தோல்வி கொள்கை (Pod failure policy) {#pod-failure-policy}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

`.spec.podFailurePolicy` புலம் கொள்கலன் வெளியேறும் குறியீடுகள் மற்றும் Pod நிலைகள் (Conditions) அடிப்படையில் விதிகளை வரையறுக்க அனுமதிக்கிறது. இந்த விதிகள் Job-ஐ எவ்வாறு கையாள வேண்டும் என்பதை தீர்மானிக்கும்.

Pod தோல்வி கொள்கை சில கொள்கலன் வெளியேறும் குறியீடுகளை Job தோல்வியாக கருதாமல் புறக்கணிக்கவோ (Ignore), Job-ஐ உடனடியாக முடிவடைந்ததாக கருதவோ (FailJob) அல்லது இயல்பான தோல்வி எண்ணிக்கையை அதிகரிக்கவோ (Count) கையாள்கிறது.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-pod-failure-policy-example
spec:
  completions: 12
  parallelism: 3
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: main
        image: docker.io/library/bash:5
        command: ["bash"]
        args:
        - -c
        - echo "Hello world!" && sleep 5 && exit 42
  backoffLimit: 6
  podFailurePolicy:
    rules:
    - action: FailJob
      onExitCodes:
        containerName: main
        operator: In
        values: [42]
    - action: Ignore
      onPodConditions:
      - type: DisruptionTarget
```

இந்த விவரக்குறிப்பில், Pod தோல்வி கொள்கையின் முதல் விதி, `main` கொள்கலன் 42 வெளியேறும் குறியீட்டுடன் தோல்வியடைந்தால் Job-ஐ தோல்வியாக குறிக்கும். இரண்டாம் விதி `DisruptionTarget` நிலையுள்ள Pod-களை புறக்கணிக்கும்.

## வெற்றி கொள்கை (Success Policy) {#success-policy}

{{< feature-state for_k8s_version="v1.30" state="alpha" >}}

`.spec.successPolicy` புலம் `Indexed` Job-களுக்கு எப்போது வெற்றியை முன்கூட்டியே அறிவிக்க வேண்டும் என்ற வரன்முறை (Criteria) அமைக்க அனுமதிக்கிறது. இது தலைவர்-தொழிலாளர் (Leader-Worker) வடிவங்களுக்கு மிகவும் பயனுள்ளது, தலைவர் Pod வெற்றிகரமாக முடிந்தவுடன் மற்ற தொழிலாளர் Pod-களை நிறுத்தலாம்.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-success-policy
spec:
  parallelism: 10
  completions: 10
  completionMode: Indexed
  successPolicy:
    rules:
    - succeededIndexes: "0"
      succeededCount: 1
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: main
        image: python
        command:
        - python3
        - -c
        - |
          import os, sys
          if os.environ.get("JOB_COMPLETION_INDEX") == "0":
              print("Leader finished")
              sys.exit(0)
          else:
              import time; time.sleep(300)
```

## முடிவு மற்றும் சுத்தம் (Termination and Cleanup) {#termination-and-cleanup}

Job முடிவடையும்போது, இனி எந்த Pod-களும் உருவாக்கப்படமாட்டாது, ஆனால் ஏற்கனவே உள்ள Pod-கள் நீக்கப்படுவதில்லை. அவற்றை வைத்திருப்பது பதிவுகளை (Logs) பார்க்க அனுமதிக்கிறது. Job பொருளும் (Object) நீக்கப்படாமல் இருக்கும், அதன் நிலையை சரிபார்க்கலாம்.

Job-ஐ நீக்க:

```shell
kubectl delete jobs/pi
```

அல்லது

```shell
kubectl delete -f https://kubernetes.io/examples/controllers/job.yaml
```

`kubectl` கட்டளையைப் பயன்படுத்தி Job-ஐ நீக்கும்போது, அது உருவாக்கிய அனைத்து Pod-களும் நீக்கப்படும்.

### முடிந்த Job-களை தானாக சுத்தம் செய்தல் {#clean-up-finished-jobs-automatically}

முடிந்த Job-களை (வெற்றிடமாக அல்லது தோல்வியுடன்) தானியங்கி முறையில் சுத்தம் செய்ய TTL (Time-To-Live) வழிமுறையை பயன்படுத்தலாம். TTL கட்டுப்படுத்தி, `.spec.ttlSecondsAfterFinished` புலத்தின் மூலம் கட்டுப்படுத்தப்படுகிறது.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-ttl
spec:
  ttlSecondsAfterFinished: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

`ttlSecondsAfterFinished` 100 என அமைக்கப்படும்போது, Job முடிந்த 100 வினாடிகளுக்கு பிறகு தானாக நீக்கப்படும். 0 என அமைக்கப்பட்டால், முடிந்தவுடன் உடனடியாக நீக்கப்படும்.

## Job வடிவங்கள் (Job Patterns) {#job-patterns}

Job பொருள் இணை கணிப்பீட்டிற்கான (Parallel Computation) பல்வேறு வடிவங்களை ஆதரிக்கிறது. கீழே உள்ள அட்டவணை பல்வேறு வடிவங்களை கோடிட்டுக் காட்டுகிறது:

| வடிவம் | ஒரு Job பொருள் | குறைவான Job-கள் | பயன்பாட்டு சிக்கலற்றது | Kube API-ல் அழுத்தம் குறைவு |
|---------|-----------------|-----------------|-------------------------|------------------------------|
| பணி உருப்படிக்கு (Work Item) ஒரு Pod உள்ள வரிசை (Queue with Pod Per Work Item) | ✓ | | ✓ | |
| மாறுபடும் Pod எண்ணிக்கையுடன் வரிசை (Queue with Variable Pod Count) | ✓ | ✓ | | |
| நிலையான பணி ஒதுக்கீட்டுடன் குறியீட்டு Job (Indexed Job with Static Work Assignment) | ✓ | | ✓ | |
| Pod-இடையே தொடர்பு (Pod-to-Pod Communication) | ✓ | | | ✓ |

`.spec.completions` மூலம் பணி உருப்படிகளைக் குறிப்பிடும்போது, Job கட்டுப்படுத்தி ஒவ்வொரு பணி உருப்படிக்கும் ஒரு Pod உருவாக்கும். அந்த Pod முடிவடையும்போது, அடுத்த பணி உருப்படிக்கான Pod உருவாக்கப்படும்.

## Job-ஐ இடைநிறுத்துதல் மற்றும் மீண்டும் தொடங்குதல் (Suspend and Resume) {#suspend}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Job-ஐ உருவாக்கும்போது, `.spec.suspend` புலத்தை `true` என அமைப்பதன் மூலம் அதை இடைநிறுத்தலாம். `.spec.suspend` புலம் `true` ஆக இருக்கும்போது, Job-இன் செயலில் உள்ள அனைத்து Pod-களும் நிறுத்தப்படும். ஆனால் அவை தோல்வியாக எண்ணப்படமாட்டாது.

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":true}}'
```

Job-ஐ மீண்டும் தொடங்க:

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":false}}'
```

Job-ஐ மீண்டும் தொடங்கும்போது, கட்டுப்படுத்தி (Controller) Pod-களை மீண்டும் உருவாக்கும். Job-ஐ இடைநிறுத்திய மற்றும் மீண்டும் தொடங்கிய நேரங்களை Job நிலை (Status) கண்காணிக்கும்.

ஒரு Job-ஐ இடைநிறுத்தும்போது:
```
Status:
  Conditions:
  - Last Probe Time:      2021-02-05T13:14:33Z
    Last Transition Time:  2021-02-05T13:14:33Z
    Status:                True
    Type:                  Suspended
  Start Time:  2021-02-05T13:13:48Z
```

## மாறக்கூடிய திட்டமிடல் உத்திகள் (Mutable Scheduling Directives) {#mutable-scheduling-directives}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

Job தொடங்குவதற்கு முன், அதாவது Job இடைநிறுத்தப்பட்டிருக்கும்போது, Job-இன் திட்டமிடல் உத்திகளை (Scheduling Directives) மாற்றலாம். இந்த புலங்களை மாற்றலாம்:

- `nodeAffinity` (புதியது அல்லது புதுப்பிப்பு, ஆனால் இருக்கும் affinity-ஐ குறைக்கவில்லை என்றால் மட்டும்)
- `nodeSelector` (புதியது அல்லது புதுப்பிப்பு, ஆனால் இருக்கும் selector-ஐ குறைக்கவில்லை என்றால் மட்டும்)
- `tolerations` (புதியது அல்லது புதுப்பிப்பு)
- `.metadata.labels` (Job-இன் முத்திரைகள் (Labels))
- `.metadata.annotations` (Job-இன் குறிப்புரைகள் (Annotations))
- `schedulingGates`

உதாரணமாக, ஒரு Job-ஐ உருவாக்கிய பின் இடைநிறுத்தி, குறிப்பிட்ட Node-களுக்கு மட்டும் திட்டமிட்ட பின் மீண்டும் தொடங்கலாம்:

```shell
kubectl patch job/myjob --type=merge --patch '{"spec":{"suspend":true}}'
kubectl patch job/myjob --type=merge --patch \
  '{"spec":{"template":{"spec":{"nodeSelector":{"disktype":"ssd"}}}}}'
kubectl patch job/myjob --type=merge --patch '{"spec":{"suspend":false}}'
```

## Job-களுக்கு மாற்றீடுகள் (Alternatives to Jobs) {#alternatives}

### வெட்டையான Pod-கள் (Bare Pods) {#bare-pods}

Pod-கள் இயங்கும் Node தூய்மைக்காக (Rebooted) அல்லது தோல்வியடையும்போது, வெட்டையான Pod-கள் மீண்டும் தொடங்கப்படமாட்டாது. ஒரு Job, Pod-ஐ மீண்டும் தொடங்குவதை கவனித்துக்கொள்வதால், Job-ஐ வெட்டையான Pod-ஐ விட பயன்படுத்துவது நல்லது.

### பிரதி கட்டுப்படுத்தி (Replication Controller) {#replication-controller}

பிரதி கட்டுப்படுத்திகள் (Replication Controllers) குறிப்பிட்ட எண்ணிக்கையிலான Pod-களை எப்போதும் இயங்கும்படி வைக்கும் நிலையான சேவைகளுக்கு (Daemon-like Services) ஏற்றவை. Job-கள் முடிந்த பின் நிறுத்தப்படும் Pod-களுக்கு ஏற்றவை, அதாவது தொகுதி பணிகளுக்கு (Batch Tasks).

### ஒரே ஒரு Job, கட்டுப்படுத்தி Pod-ஐ தொடங்குகிறது {#single-job-starts-controller-pod}

ஒரு வேறுபாடு என்னவெனில், ஒரு Pod-ஐ தொடங்கும் Job-ஐ உருவாக்கலாம், அந்த Pod தன்னிடையே மற்ற Pod-களை உருவாக்கும், இது ஒரு தனிப்பயன் கட்டுப்படுத்தியாக (Custom Controller) செயல்படும். இது அதிக நெகிழ்வை (Flexibility) தருகிறது, ஆனால் தொடங்குவதற்கு சிக்கலானது மற்றும் Kubernetes-உடன் ஒருங்கிணைப்பு குறைவு.

## {{% heading "whatsnext" %}}

* [Pod-களைப் பற்றி](/docs/concepts/workloads/pods/) அறிந்துகொள்ளுங்கள்.
* [CronJob-களைப் பற்றி](/docs/concepts/workloads/controllers/cron-jobs/) படிக்கவும்: திட்டமிட்ட (Scheduled) Job-களை எவ்வாறு இயக்குவது என்று.
* [தானியங்கி பணிகளை இயக்குவதைப் பற்றி](/docs/tasks/job/) படிக்கவும்.
* [கரடுமுரடான இணை செயலாக்கம்](/docs/tasks/job/coarse-parallel-processing-work-queue/) மற்றும் [நுட்பமான இணை செயலாக்கம்](/docs/tasks/job/fine-parallel-processing-work-queue/) பற்றி படிக்கவும்.
* [batch/v1 Job API](/docs/reference/kubernetes-api/workload-resources/job-v1/) குறிப்பை படிக்கவும்.
