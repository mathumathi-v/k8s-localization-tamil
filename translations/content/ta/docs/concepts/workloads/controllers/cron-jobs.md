---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
api_metadata:
- apiVersion: "batch/v1"
  kind: "CronJob"
description: >-
  ஒரு CronJob என்பது திரும்பத்திரும்ப திட்டமிடப்பட்ட பணிகளை (repeated scheduled tasks) நிர்வகிக்கிறது. ஒவ்வொரு பணியும் ஒரு முறை அல்லது பல முறை இயக்கப்படலாம்.
content_type: concept
weight: 80
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

ஒரு _CronJob_ என்பது திரும்பத்திரும்ப இயங்கும் திட்டமிடப்பட்ட பணிகளை (Workload - பணிச்சுமை) உருவாக்குகிறது. ஒரு CronJob ஆனது Cron அட்டவணையின் (schedule) படி Job-களை (பணிகளை) தானாகவே துவக்குகிறது.

{{< caution >}}
CronJob-களுக்கு சில வரம்புகள் மற்றும் குறிப்பிட தக்க விஷயங்கள் உள்ளன. எடுத்துக்காட்டாக, சில சூழல்களில், ஒரே ஒரு CronJob ஆல் ஒன்றுக்கு மேற்பட்ட Job-கள் உருவாக்கப்படலாம். எனவே, Job-கள் _idempotent_ (மீண்டும் இயக்கப்படும்போதும் ஒரே விளைவை தரக்கூடிய) ஆக இருக்க வேண்டும்.

மேலும் தகவலுக்கு [CronJob வரம்புகள்](#cronjob-limitations) பிரிவைப் பார்க்கவும்.
{{< /caution >}}

<!-- body -->

## எடுத்துக்காட்டு (Example) {#example}

இந்த CronJob எடுத்துக்காட்டு ஒவ்வொரு நிமிடமும் தற்போதைய நேரத்தையும் ஒரு வரவேற்பு செய்தியையும் அச்சிடுகிறது:

{{< codenew file="application/job/cronjob.yaml" >}}

([CronJob இயக்குதல்](/docs/tasks/job/automated-tasks-with-cron-jobs/) இந்த எடுத்துக்காட்டை இன்னும் விரிவாக விளக்குகிறது.)

## CronJob spec எழுதுதல் {#writing-a-cronjob-spec}

மற்ற எல்லா Kubernetes கட்டமைப்புகளைப் போலவே, ஒரு CronJob-க்கும் `apiVersion`, `kind`, மற்றும் `metadata` புலங்கள் தேவைப்படுகின்றன.

ஒரு CronJob-இன் `.spec` பிரிவில் பின்வரும் தகவல்கள் இருக்கும்:

### அட்டவணை தொடரியல் (Schedule syntax) {#schedule-syntax}

`.spec.schedule` புலம் ஒரு [Cron](https://en.wikipedia.org/wiki/Cron) வடிவத்தில் (format) அட்டவணையை (schedule) குறிப்பிடுகிறது:

```
# ┌───────────── நிமிடம் (minute) (0 - 59)
# │ ┌───────────── மணி நேரம் (hour) (0 - 23)
# │ │ ┌───────────── மாதத்தின் நாள் (day of the month) (1 - 31)
# │ │ │ ┌───────────── மாதம் (month) (1 - 12)
# │ │ │ │ ┌───────────── வாரத்தின் நாள் (day of the week) (0 - 6) (ஞாயிறு முதல் சனி வரை;
# │ │ │ │ │                                   7 சில அமைப்புகளில் ஞாயிறையும் குறிக்கும்)
# │ │ │ │ │                                   அல்லது sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │
# * * * * *
```

| நுழைவு (Entry)             | விளக்கம் (Description)                                                | சமம் (Equivalent to) |
| -------------------------  | ---------------------------------------------------------------------  | -------------------  |
| @yearly (அல்லது @annually) | ஜனவரி 1 நள்ளிரவில் ஒரு முறை இயக்கு                                    | `0 0 1 1 *`          |
| @monthly                   | ஒவ்வொரு மாதமும் முதல் நாள் நள்ளிரவில் ஒரு முறை இயக்கு               | `0 0 1 * *`          |
| @weekly                    | ஒவ்வொரு வாரமும் ஞாயிற்றுக்கிழமை நள்ளிரவில் ஒரு முறை இயக்கு          | `0 0 * * 0`          |
| @daily (அல்லது @midnight)  | ஒவ்வொரு நாளும் நள்ளிரவில் ஒரு முறை இயக்கு                            | `0 0 * * *`          |
| @hourly                    | ஒவ்வொரு மணி நேரத்தின் தொடக்கத்தில் ஒரு முறை இயக்கு                   | `0 * * * *`          |

நடைமுறைக்காக, `.spec.schedule` ஆனது கேள்விக்குறி (`?`) ஐயும் ஆதரிக்கிறது, இது நட்சத்திரம் (`*`) போலவே செயல்படுகிறது — அதாவது, கொடுக்கப்பட்ட புலத்திற்கு எந்த மதிப்பும் ஏற்றுக்கொள்ளப்படும்.

`CRON_TZ` அல்லது `TZ` ஐப் பயன்படுத்தி Cron அட்டவணைக்கு ஒரு நேர மண்டலத்தை (timezone) குறிப்பிடலாம். எடுத்துக்காட்டாக:

```
CRON_TZ=UTC * * * * *
```

{{< caution >}}
Cron வரிகளில் `TZ` அல்லது `CRON_TZ` ஐப் பயன்படுத்துவது, போதுமான ஆவணங்கள் இல்லாத நடத்தை (behaviour) ஆகும், மேலும் எதிர்காலத்தில் இது நீக்கப்படலாம். அதற்கு பதிலாக `.spec.timeZone` ஐப் பயன்படுத்தவும். மேலும் தகவலுக்கு [நேர மண்டலங்கள்](#time-zones) பிரிவைப் பார்க்கவும்.
{{< /caution >}}

### Job வார்ப்புரு (Job template) {#job-template}

`.spec.jobTemplate` என்பது Job-க்கான வார்ப்புரு (template) ஆகும், இது தேவைப்படும் போது உருவாக்கப்படும். இது ஒரு [Job](/docs/concepts/workloads/controllers/job/) போலவே இருக்கும், ஆனால் அதன் `apiVersion` மற்றும் `kind` இல்லாமல். இந்த Job வார்ப்புருவிற்கும், ஒரு Job Spec-க்கும் ஒரே மாதிரியான Schema இருக்கும். CronJob-இன் `.spec.jobTemplate.spec` இல் Job-இற்கான `.spec` மட்டுமே இருக்க வேண்டும். CronJob-க்கான [`.spec.jobTemplate.metadata`](/docs/reference/kubernetes-api/workload-resources/cron-job-v1/#CronJobSpec) இல் முத்திரைகளும் (Labels) குறிப்புகளும் (Annotations) இருக்கலாம்.

### தாமதமான Job தொடக்கத்திற்கான காலக்கெடு (Deadline for delayed Job start) {#deadline-for-delayed-job-start}

`.spec.startingDeadlineSeconds` புலம் ஐச்சையமானது (optional). இது, ஏதேனும் காரணத்தால் திட்டமிட்ட நேரம் தவறவிட்டால், ஒரு Job-ஐ தொடங்குவதற்கான காலக்கெடு (deadline) ஐ வினாடிகளில் குறிப்பிடுகிறது.

காலக்கெடு முடிந்துவிட்டால், அந்த Job ஆனது அந்த இடைவேளைக்கு (interval) தவறவிட்டதாகக் கணக்கிடப்படும். காலக்கெடு இல்லாத CronJob-களுக்கு, தவறவிட்ட Job-கள் எப்போதும் இயக்கப்படும். நீங்கள் `.spec.startingDeadlineSeconds` ஐ அமைத்திருந்தால், Kubernetes-இன் கட்டுப்படுத்தி (Controller) ஆனது கடந்த `startingDeadlineSeconds` வினாடிகளுக்கு உள்ளே எத்தனை தவறவிட்ட Job-கள் உள்ளன என்பதை மட்டுமே கணக்கிடும். கடந்த நேரம் மட்டுமே கணக்கில் எடுத்துக்கொள்ளப்படும்.

எடுத்துக்காட்டாக, `.spec.startingDeadlineSeconds` ஐ `200` என அமைத்திருந்தால், கட்டுப்படுத்தியானது (Controller) கடந்த 200 வினாடிகளில் தவறவிட்ட எத்தனை Job-கள் உள்ளன என்பதை மட்டுமே கணக்கிடும்.

### ஒருங்கிணைப்புக் கொள்கை (Concurrency policy) {#concurrency-policy}

`.spec.concurrencyPolicy` புலம் ஐச்சையமானது (optional). இது CronJob-ஆல் உருவாக்கப்பட்ட Job-களின் ஒருங்கிணைப்பு (concurrent execution) செயல்படுத்தலை எவ்வாறு கையாள வேண்டும் என்பதை குறிப்பிடுகிறது. spec-இல் பின்வரும் ஒருங்கிணைப்புக் கொள்கைகளில் ஒன்றை மட்டுமே குறிப்பிடலாம்:

* `Allow` (இயல்பு மதிப்பு): CronJob ஒரே நேரத்தில் இயங்கும் Job-களை அனுமதிக்கிறது.
* `Forbid`: CronJob ஒரே நேரத்தில் இயங்கும் Job-களை அனுமதிக்காது; புதிய Job ஒன்றை இயக்கும் நேரம் வந்திருந்தாலும் முந்தைய Job இன்னும் முடிக்கப்படவில்லை என்றால், CronJob புதிய Job-ஐ தவிர்க்கும்.
* `Replace`: முந்தைய Job இன்னும் இயங்கிக்கொண்டிருந்தால், புதிய Job அதை மாற்றும்.

கவனிக்க வேண்டியது என்னவெனில், ஒருங்கிணைப்புக் கொள்கை (concurrency policy) ஒரே CronJob-ஆல் உருவாக்கப்படும் Job-களுக்கு மட்டுமே பொருந்தும். வெவ்வேறு CronJob-களால் உருவாக்கப்படும் Job-கள் ஒரே நேரத்தில் இயங்கலாம்.

### அட்டவணை இடைநிறுத்தம் (Schedule suspension) {#schedule-suspension}

`.spec.suspend` ஐ `true` என அமைப்பதன் மூலம் CronJob-இற்கான அடுத்தடுத்த செயல்பாடுகளை இடைநிறுத்தலாம். இந்த புலம் ஏற்கனவே தொடங்கப்பட்ட Job-களை பாதிக்காது.

```shell
kubectl patch cronjobs <job-name> -p '{"spec" : {"suspend" : true }}'
```

### Job வரலாற்று வரம்புகள் (Jobs history limits) {#jobs-history-limits}

`.spec.successfulJobsHistoryLimit` மற்றும் `.spec.failedJobsHistoryLimit` புலங்கள் ஐச்சையமானவை (optional). இந்த புலங்கள் எத்தனை முடிந்த மற்றும் தோல்வியுற்ற Job-களை வைத்திருக்க வேண்டும் என்பதை குறிப்பிடுகின்றன.

இயல்பாக, அவை முறையே `3` மற்றும் `1` என அமைக்கப்பட்டிருக்கும். வரம்பை `0` என அமைப்பது எந்த Job-களையும் வைத்திருக்காது.

CronJob ஒன்றைப் பயன்படுத்தி தொடர்ச்சியான Job-களை நிர்வகிக்கும்போது, பின்வரும் முன்னெச்சரிக்கைகளை கவனத்தில் கொள்ளுங்கள்:
- `successfulJobsHistoryLimit` மற்றும் `failedJobsHistoryLimit` புலங்கள் பூஜ்ஜியமற்ற நேர்மறை முழு எண்களாக (non-negative integers) இருக்க வேண்டும். வேறு வகையில் குறிப்பிடப்படாவிட்டால், Kubernetes இயல்பு மதிப்புகளைப் பயன்படுத்தும்.

### நேர மண்டலங்கள் (Time zones) {#time-zones}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

நேர மண்டல (time zone) குறிப்பின்றி ஒரு CronJob-ஐ உருவாக்கும் போது, kube-controller-manager (கட்டுப்படுத்தி நிர்வாகி) இன் நேர மண்டலத்தின் படி கணக்கிடப்படுகிறது. Kubernetes v1.27 முதல், `.spec.timeZone` என்ற புலம் நேர மண்டலத்தை குறிப்பிட அனுமதிக்கிறது. [tz database](https://en.wikipedia.org/wiki/Tz_database) இல் உள்ள சரியான நேர மண்டல பெயரை பயன்படுத்தலாம்.

Kubernetes இல் `spec.timeZone: "Etc/UTC"` என்று குறிப்பிடுவதன் மூலம் UTC நேர மண்டலத்தை வெளிப்படையாக அமைக்கலாம்.

{{< note >}}
`.spec.schedule` இல் `TZ` அல்லது `CRON_TZ` என்ற நேர மண்டல குறிப்பை வழங்குவது `spec.timeZone` அமைப்பை விட முன்னுரிமை கொண்டது. இரண்டும் அமைக்கப்பட்டால், கட்டுப்படுத்தி (Controller) schedule-இல் உள்ளதை மட்டுமே ஏற்கும்.
{{< /note >}}

## CronJob வரம்புகள் {#cronjob-limitations}

### ஆதரிக்கப்படாத நேர மண்டலம் (Unsupported TimeZone) {#unsupported-timezone}

`.spec.timeZone` ஆல் ஆதரிக்கப்படாத ஒரு நேர மண்டலத்தை குறிப்பிட்டால் அல்லது தவறான வடிவத்தில் குறிப்பிட்டால், CronJob கட்டுப்படுத்தியானது புதிய Job-களை திட்டமிட மாட்டான் மேலும் ஒரு பிழை நிகழ்வை (error event) பதிவு செய்யும்.

### திருத்தம் (Modifying) {#modifying-a-cronjob}

ஒரு CronJob-ஐ உருவாக்கிய பிறகு, அதன் `.spec` ஐ திருத்துவதற்கு வரம்புகள் உள்ளன. குறிப்பாக, பின்வரும் புலங்கள் மாற்றத்தகும் (mutable):

- `.spec.schedule`
- `.spec.startingDeadlineSeconds`
- `.spec.concurrencyPolicy`
- `.spec.suspend`
- `.spec.successfulJobsHistoryLimit`
- `.spec.failedJobsHistoryLimit`
- `.spec.timeZone`

`.spec.jobTemplate` புலத்தை மாற்றுவது புதிய Job-களுக்கு மட்டுமே பொருந்தும்; ஏற்கனவே இயங்கிக்கொண்டிருக்கும் Job-களை பாதிக்காது.

### தவறவிட்ட அட்டவணைகளுடன் Job உருவாக்கம் (Job creation with missed schedules) {#job-creation}

ஒரு CronJob ஒரு குறிப்பிட்ட கால இடைவெளியில் (interval) இயங்க தவறினால், அது தவறவிட்ட (missed) Job என்று கணக்கிடப்படும்.

எடுத்துக்காட்டாக, `startingDeadlineSeconds` `200` என அமைக்கப்பட்டிருந்தால், கட்டுப்படுத்தியானது (Controller) கடந்த 200 வினாடிகளில் எத்தனை இயக்கங்கள் தவறவிட்டன என்பதை கணக்கிடும். 100 க்கும் மேற்பட்ட தவறவிட்ட Job-கள் இருந்தால், CronJob இன்னும் கூடுதல் Job-களை திட்டமிட மறுக்கும் மற்றும் ஒரு பிழை நிகழ்வை (error event) பதிவு செய்யும்:

```
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

கட்டுப்படுத்தி கண்காணிப்பில் (controller monitoring) கால இடைவெளி ஏற்பட்டால் மற்றும் அந்த இடைவெளியில் 100 க்கும் மேற்பட்ட Job-கள் தவறவிட்டால், அடுத்த Job-கள் திட்டமிடப்படாமல் போகலாம் என்பதை கவனத்தில் கொள்ளுங்கள். கட்டுப்படுத்தி மீட்டமைவுக்கு (controller restart) ஒரு நீண்ட இடைவெளி இருக்கும்போது, இது நடக்கலாம்.

`startingDeadlineSeconds` அமைக்கப்படாமல் இருந்தால் அல்லது `nil` என அமைக்கப்பட்டிருந்தால், CronJob-கட்டுப்படுத்தி (CronJob Controller) கடந்த உருவாக்கும் நேரத்திலிருந்து (last scheduled time) இதுவரை தவறவிட்ட Job-களை கணக்கிடும்.

`startingDeadlineSeconds` ஒரு சிறிய மதிப்பாக (எடுத்துக்காட்டாக 10 வினாடிகள்) அமைக்கப்பட்டிருந்தால், அடுத்த Job ஒரு போதும் திட்டமிடப்படாமல் போகலாம். இது CronJob-கட்டுப்படுத்தியானது கட்டுப்படுத்தும் திட்டமிடல் (schedule) மற்றும் நிகழ்வு (event) சரிபார்ப்பு சுழற்சிகளில் தாமதம் ஏற்படும்போது நடக்கலாம்.

{{< note >}}
நேர மண்டல (time zone) சிக்கல்கள் Job-ஐ ஒரு போதும் திட்டமிட முடியாத நிலைக்கு வழிவகுக்கலாம் அல்லது தவறாக இரண்டு முறை திட்டமிடப்படலாம்.
{{< /note >}}

## {{% heading "whatsnext" %}}

* [CronJob-களில் தானியங்கி பணிகள்](/docs/tasks/job/automated-tasks-with-cron-jobs/) என்பது படிப்படியான பயிற்சியை (tutorial) வழங்குகிறது.
* [Job](/docs/concepts/workloads/controllers/job/) பற்றி படியுங்கள்.
* CronJob-களை உருவாக்குவதற்கான [`kubectl` reference](/docs/reference/generated/kubectl/kubectl-commands/#-em-cronjob-em-) ஐப் பாருங்கள்.
* [CronJob](/docs/reference/kubernetes-api/workload-resources/cron-job-v1/) API reference-ஐப் பாருங்கள்.
