---
reviewers:
- janetkuo
title: Deployment-கள்
api_metadata:
- apiVersion: "apps/v1"
  kind: "Deployment"
feature:
  title: தானியங்கி உருளும் புதுப்பிப்புகள் மற்றும் பின்னோக்கி மாற்றங்கள்
  description: >
    Kubernetes உங்கள் பயன்பாடு அல்லது அதன் உள்ளமைவில் (Configuration) மாற்றங்களை படிப்படியாக வெளியிடுகிறது, அதே நேரத்தில் பயன்பாட்டு ஆரோக்கியத்தை கண்காணித்து உங்கள் அனைத்து நிகழ்வுகளையும் ஒரே நேரத்தில் நிறுத்தாமல் இருப்பதை உறுதி செய்கிறது. ஏதாவது தவறு நடந்தால், Kubernetes உங்களுக்காக மாற்றத்தை பின்னோக்கி மாற்றும். வளர்ந்து வரும் வரிசைப்படுத்தல் தீர்வுகளின் சுற்றுச்சூழல் அமைப்பை பயன்படுத்திக்கொள்ளுங்கள்.
description: >-
  ஒரு Deployment என்பது பயன்பாட்டு பணிச்சுமையை இயக்க Pod-களின் தொகுப்பை நிர்வகிக்கிறது, வழக்கமாக நிலையை பராமரிக்காதது.
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

ஒரு _Deployment_ {{< glossary_tooltip text="Pod-கள்" term_id="pod" >}} மற்றும்
{{< glossary_tooltip term_id="replica-set" text="ReplicaSet-கள்" >}} க்கான அறிவிப்பு வகை புதுப்பிப்புகளை வழங்குகிறது.

ஒரு Deployment-இல் _விரும்பிய நிலையை_ நீங்கள் விவரிக்கிறீர்கள், மேலும் Deployment {{< glossary_tooltip term_id="controller" >}} கட்டுப்படுத்தப்பட்ட வேகத்தில் உண்மையான நிலையை விரும்பிய நிலைக்கு மாற்றுகிறது. புதிய ReplicaSet-களை உருவாக்க அல்லது ஏற்கனவே உள்ள Deployment-களை அகற்றி அவற்றின் அனைத்து வளங்களையும் புதிய Deployment-களுடன் ஏற்றுக்கொள்ள Deployment-களை வரையறுக்கலாம்.

{{< note >}}
ஒரு Deployment-க்கு சொந்தமான ReplicaSet-களை நிர்வகிக்க வேண்டாம். உங்கள் பயன்பாட்டு வழக்கு கீழே உள்ளவற்றால் கையாளப்படவில்லை என்றால் முக்கிய Kubernetes repository-யில் ஒரு issue திறக்கவும்.
{{< /note >}}

<!-- body -->

## பயன்பாட்டு வழக்கு

Deployment-களுக்கான வழக்கமான பயன்பாட்டு வழக்குகள் பின்வருமாறு:

* [ReplicaSet-ஐ வெளியிட ஒரு Deployment உருவாக்குங்கள்](#creating-a-deployment). ReplicaSet பின்னணியில் Pod-களை உருவாக்குகிறது. வெளியீடு வெற்றியா இல்லையா என்பதைப் பார்க்க rollout நிலையைச் சரிபார்க்கவும்.
* Deployment-இன் PodTemplateSpec-ஐ புதுப்பிப்பதன் மூலம் [Pod-களின் புதிய நிலையை அறிவிக்கவும்](#updating-a-deployment). ஒரு புதிய ReplicaSet உருவாக்கப்படுகிறது, மேலும் Deployment படிப்படியாக அதை அளவிடுகிறது, அதே நேரத்தில் பழைய ReplicaSet-ஐ குறைக்கிறது, Pod-கள் கட்டுப்படுத்தப்பட்ட வேகத்தில் மாற்றப்படுவதை உறுதி செய்கிறது. ஒவ்வொரு புதிய ReplicaSet-ம் Deployment-இன் திருத்தத்தை புதுப்பிக்கிறது.
* Deployment-இன் தற்போதைய நிலை நிலையானதாக இல்லை என்றால் [முந்தைய Deployment திருத்தத்திற்கு பின்னோக்கி மாறுங்கள்](#rolling-back-a-deployment). ஒவ்வொரு பின்னோக்கி மாற்றமும் Deployment-இன் திருத்தத்தை புதுப்பிக்கிறது.
* [அதிக சுமையை ஏற்க Deployment-ஐ அளவிடுங்கள்](#scaling-a-deployment).
* PodTemplateSpec-க்கு பல திருத்தங்களைப் பயன்படுத்த [Deployment-இன் rollout-ஐ இடைநிறுத்தி](#pausing-and-resuming-a-deployment) பிறகு புதிய rollout-ஐ தொடங்க மீண்டும் தொடங்குங்கள்.
* rollout சிக்கியுள்ளதா என்பதன் குறிகாட்டியாக [Deployment நிலையைப் பயன்படுத்துங்கள்](#deployment-status).
* உங்களுக்கு இனி தேவையில்லாத [பழைய ReplicaSet-களை சுத்தம் செய்யுங்கள்](#clean-up-policy).

## Deployment உருவாக்குதல்

பின்வருவது Deployment-இன் ஒரு உதாரணமாகும். இது மூன்று `nginx` Pod-களைக் கொண்டு வர ஒரு ReplicaSet-ஐ உருவாக்குகிறது:

{{% code_sample file="controllers/nginx-deployment.yaml" %}}

இந்த உதாரணத்தில்:

* `nginx-deployment` என்ற பெயரில் ஒரு Deployment உருவாக்கப்படுகிறது, `.metadata.name` புலத்தால் குறிக்கப்படுகிறது. இந்தப் பெயர் பின்னர் உருவாக்கப்படும் ReplicaSet-கள் மற்றும் Pod-களுக்கு அடிப்படையாக மாறும். மேலும் விவரங்களுக்கு [Deployment Spec எழுதுதல்](#writing-a-deployment-spec) பார்க்கவும்.
* `.spec.replicas` புலத்தால் குறிக்கப்படுவது போல் மூன்று நகலெடுக்கப்பட்ட Pod-களை உருவாக்கும் ஒரு ReplicaSet-ஐ Deployment உருவாக்குகிறது.
* `.spec.selector` புலம் உருவாக்கப்பட்ட ReplicaSet எந்த Pod-களை நிர்வகிக்க வேண்டும் என்பதை எவ்வாறு கண்டறிகிறது என்பதை வரையறுக்கிறது. இந்த வழக்கில், Pod template-இல் வரையறுக்கப்பட்ட ஒரு முத்திரையைத் தேர்ந்தெடுக்கிறீர்கள் (`app: nginx`). இருப்பினும், Pod template தானே விதியை பூர்த்தி செய்யும் வரை, மிகவும் சிக்கலான தேர்வு விதிகள் சாத்தியமாகும்.

  {{< note >}}
  `.spec.selector.matchLabels` புலம் {key,value} ஜோடிகளின் வரைபடமாகும்.
  `matchLabels` வரைபடத்தில் உள்ள ஒரு {key,value} என்பது `matchExpressions`-இன் ஒரு உறுப்புக்கு சமமானது, அதில் `key` புலம் "key", `operator` "In", மற்றும் `values` அணி "value" மட்டுமே கொண்டுள்ளது.
  பொருந்துவதற்கு `matchLabels` மற்றும் `matchExpressions` இரண்டிலிருந்தும் அனைத்து தேவைகளும் பூர்த்தி செய்யப்பட வேண்டும்.
  {{< /note >}}

* `.spec.template` புலம் பின்வரும் துணைப் புலங்களைக் கொண்டுள்ளது:
  * `.metadata.labels` புலத்தைப் பயன்படுத்தி Pod-கள் `app: nginx` என்று முத்திரையிடப்படுகின்றன.
  * Pod template-இன் விவரக்குறிப்பு, அல்லது `.spec` புலம், Pod-கள் ஒரு கொள்கலனை இயக்குகின்றன என்பதைக் குறிக்கிறது, `nginx`, இது `nginx` [Docker Hub](https://hub.docker.com/) படத்தை 1.14.2 பதிப்பில் இயக்குகிறது.
  * `.spec.containers[0].name` புலத்தைப் பயன்படுத்தி ஒரு கொள்கலனை உருவாக்கி அதற்கு `nginx` என்று பெயரிடுங்கள்.

தொடங்குவதற்கு முன், உங்கள் Kubernetes கொத்து இயங்கிக்கொண்டிருப்பதை உறுதிசெய்யுங்கள்.
மேலே உள்ள Deployment-ஐ உருவாக்க கீழே கொடுக்கப்பட்ட படிகளைப் பின்பற்றுங்கள்:

1. பின்வரும் கட்டளையை இயக்குவதன் மூலம் Deployment-ஐ உருவாக்குங்கள்:

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

2. Deployment உருவாக்கப்பட்டதா என சரிபார்க்க `kubectl get deployments` இயக்கவும்.

   Deployment இன்னும் உருவாக்கப்பட்டுக்கொண்டிருந்தால், வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```
   உங்கள் கொத்தில் உள்ள Deployment-களை நீங்கள் ஆய்வு செய்யும்போது, பின்வரும் புலங்கள் காட்டப்படும்:
   * `NAME` Namespace-இல் உள்ள Deployment-களின் பெயர்களை பட்டியலிடுகிறது.
   * `READY` உங்கள் பயனர்களுக்கு கிடைக்கும் பயன்பாட்டின் எத்தனை பிரதிகள் உள்ளன என்பதைக் காட்டுகிறது. இது ready/desired வடிவத்தைப் பின்பற்றுகிறது.
   * `UP-TO-DATE` விரும்பிய நிலையை அடைய புதுப்பிக்கப்பட்ட பிரதிகளின் எண்ணிக்கையைக் காட்டுகிறது.
   * `AVAILABLE` உங்கள் பயனர்களுக்கு கிடைக்கும் பயன்பாட்டின் எத்தனை பிரதிகள் உள்ளன என்பதைக் காட்டுகிறது.
   * `AGE` பயன்பாடு இயங்கிக் கொண்டிருக்கும் நேர அளவைக் காட்டுகிறது.

   `.spec.replicas` புலத்தின் படி விரும்பிய பிரதிகளின் எண்ணிக்கை 3 என்பதை கவனியுங்கள்.

3. Deployment rollout நிலையைப் பார்க்க, `kubectl rollout status deployment/nginx-deployment` இயக்கவும்.

   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

4. சில நொடிகள் கழித்து மீண்டும் `kubectl get deployments` இயக்கவும்.
   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```
   Deployment அனைத்து மூன்று பிரதிகளையும் உருவாக்கியுள்ளது என்பதையும், அனைத்து பிரதிகளும் புதுப்பித்த நிலையில் (அவை சமீபத்திய Pod template-ஐ கொண்டுள்ளன) மற்றும் கிடைக்கின்றன என்பதையும் கவனியுங்கள்.

5. Deployment-ஆல் உருவாக்கப்பட்ட ReplicaSet (`rs`)-ஐ பார்க்க, `kubectl get rs` இயக்கவும். வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```
   ReplicaSet வெளியீடு பின்வரும் புலங்களைக் காட்டுகிறது:

   * `NAME` Namespace-இல் உள்ள ReplicaSet-களின் பெயர்களை பட்டியலிடுகிறது.
   * `DESIRED` பயன்பாட்டின் விரும்பிய _பிரதிகளின்_ எண்ணிக்கையைக் காட்டுகிறது, இது Deployment-ஐ உருவாக்கும்போது நீங்கள் வரையறுக்கிறீர்கள். இது _விரும்பிய நிலை_.
   * `CURRENT` தற்போது இயங்கும் பிரதிகளின் எண்ணிக்கையைக் காட்டுகிறது.
   * `READY` உங்கள் பயனர்களுக்கு கிடைக்கும் பயன்பாட்டின் எத்தனை பிரதிகள் உள்ளன என்பதைக் காட்டுகிறது.
   * `AGE` பயன்பாடு இயங்கிக் கொண்டிருக்கும் நேர அளவைக் காட்டுகிறது.

   ReplicaSet-இன் பெயர் எப்போதும் `[DEPLOYMENT-NAME]-[HASH]` வடிவத்தில் இருக்கும் என்பதை கவனியுங்கள். இந்தப் பெயர் உருவாக்கப்படும் Pod-களுக்கு அடிப்படையாக மாறும்.

   `HASH` சரம் ReplicaSet-இல் உள்ள `pod-template-hash` முத்திரையைப் போன்றதே.

6. ஒவ்வொரு Pod-க்கும் தானாகவே உருவாக்கப்பட்ட முத்திரைகளைப் பார்க்க, `kubectl get pods --show-labels` இயக்கவும்.
   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   ```
   உருவாக்கப்பட்ட ReplicaSet மூன்று `nginx` Pod-கள் இருப்பதை உறுதி செய்கிறது.

{{< note >}}
Deployment-இல் பொருத்தமான தேர்வாளர் மற்றும் Pod template முத்திரைகளை நீங்கள் குறிப்பிட வேண்டும்
(இந்த வழக்கில், `app: nginx`).

மற்ற கட்டுப்படுத்திகளுடன் (மற்ற Deployment-கள் மற்றும் StatefulSet-கள் உட்பட) முத்திரைகள் அல்லது தேர்வாளர்களை மேற்பொருத்த வேண்டாம். Kubernetes மேற்பொருத்தத்தை தடுக்காது, மேலும் பல கட்டுப்படுத்திகள் மேற்பொருந்தும் தேர்வாளர்களைக் கொண்டிருந்தால் அந்த கட்டுப்படுத்திகள் முரண்படலாம் மற்றும் எதிர்பாராத விதமாக செயல்படலாம்.
{{< /note >}}

### Pod-template-hash முத்திரை

{{< caution >}}
இந்த முத்திரையை மாற்ற வேண்டாம்.
{{< /caution >}}

`pod-template-hash` முத்திரை Deployment கட்டுப்படுத்தியால் Deployment உருவாக்கும் அல்லது ஏற்றுக்கொள்ளும் ஒவ்வொரு ReplicaSet-க்கும் சேர்க்கப்படுகிறது.

இந்த முத்திரை Deployment-இன் குழந்தை ReplicaSet-கள் மேற்பொருந்தாமல் இருப்பதை உறுதி செய்கிறது. ReplicaSet-இன் `PodTemplate`-ஐ hash செய்து, அதன் விளைவாக வரும் hash-ஐ ReplicaSet தேர்வாளர், Pod template முத்திரைகள் மற்றும் ReplicaSet-க்கு இருக்கக்கூடிய ஏற்கனவே உள்ள Pod-களில் சேர்க்கப்படும் முத்திரை மதிப்பாகப் பயன்படுத்தி இது உருவாக்கப்படுகிறது.

## Deployment-ஐ புதுப்பித்தல்

{{< note >}}
ஒரு Deployment-இன் rollout, Deployment-இன் Pod template (அதாவது `.spec.template`) மாற்றப்படும் போது மட்டுமே தூண்டப்படும், எடுத்துக்காட்டாக template-இன் முத்திரைகள் அல்லது கொள்கலன் படங்கள் புதுப்பிக்கப்பட்டால். Deployment-ஐ அளவிடுதல் போன்ற பிற புதுப்பிப்புகள் rollout-ஐ தூண்டாது.
{{< /note >}}

உங்கள் Deployment-ஐ புதுப்பிக்க கீழே கொடுக்கப்பட்ட படிகளைப் பின்பற்றுங்கள்:

1. `nginx:1.14.2` படத்திற்கு பதிலாக `nginx:1.16.1` படத்தைப் பயன்படுத்த nginx Pod-களைப் புதுப்பிப்போம்.

   ```shell
   kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```

   அல்லது பின்வரும் கட்டளையைப் பயன்படுத்தவும்:

   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   ```
   இங்கு `deployment/nginx-deployment` Deployment-ஐ குறிக்கிறது, `nginx` புதுப்பிப்பு நடக்கும் கொள்கலனைக் குறிக்கிறது மற்றும் `nginx:1.16.1` புதிய படம் மற்றும் அதன் tag-ஐ குறிக்கிறது.


   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:

   ```
   deployment.apps/nginx-deployment image updated
   ```

   மாற்றாக, நீங்கள் Deployment-ஐ `edit` செய்து `.spec.template.spec.containers[0].image`-ஐ `nginx:1.14.2`-இலிருந்து `nginx:1.16.1`-க்கு மாற்றலாம்:

   ```shell
   kubectl edit deployment/nginx-deployment
   ```

   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:

   ```
   deployment.apps/nginx-deployment edited
   ```

2. rollout நிலையைப் பார்க்க, இயக்கவும்:

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   ```

   அல்லது

   ```
   deployment "nginx-deployment" successfully rolled out
   ```

உங்கள் புதுப்பிக்கப்பட்ட Deployment பற்றி மேலும் விவரங்களைப் பெறுங்கள்:

* rollout வெற்றிகரமாக முடிந்த பிறகு, `kubectl get deployments` இயக்குவதன் மூலம் Deployment-ஐ பார்க்கலாம்.
  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:

  ```
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           36s
  ```

* Deployment புதிய ReplicaSet-ஐ உருவாக்கி அதை 3 பிரதிகளுக்கு அளவிட்டது, அதேபோல் பழைய ReplicaSet-ஐ 0 பிரதிகளுக்கு குறைத்தது என்பதைப் பார்க்க `kubectl get rs` இயக்கவும்.

  ```shell
  kubectl get rs
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

* `get pods` இயக்குவது இப்போது புதிய Pod-களை மட்டுமே காட்ட வேண்டும்:

  ```shell
  kubectl get pods
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME                                READY     STATUS    RESTARTS   AGE
  nginx-deployment-1564180365-khku8   1/1       Running   0          14s
  nginx-deployment-1564180365-nacti   1/1       Running   0          14s
  nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
  ```

  அடுத்த முறை இந்த Pod-களைப் புதுப்பிக்க விரும்பும்போது, Deployment-இன் Pod template-ஐ மீண்டும் புதுப்பிக்க வேண்டும்.

  Deployment புதுப்பிக்கப்படும்போது ஒரு குறிப்பிட்ட எண்ணிக்கையிலான Pod-கள் மட்டுமே கீழே இருப்பதை உறுதி செய்கிறது. இயல்பாக, விரும்பிய Pod-களின் எண்ணிக்கையில் குறைந்தது 75% Pod-கள் இயங்குவதை (25% max unavailable) உறுதி செய்கிறது.

  Deployment விரும்பிய Pod-களின் எண்ணிக்கைக்கு மேல் ஒரு குறிப்பிட்ட எண்ணிக்கையிலான Pod-கள் மட்டுமே உருவாக்கப்படுவதையும் உறுதி செய்கிறது. இயல்பாக, விரும்பிய Pod-களின் எண்ணிக்கையில் அதிகபட்சம் 125% Pod-கள் இயங்குவதை (25% max surge) உறுதி செய்கிறது.

  எடுத்துக்காட்டாக, மேலே உள்ள Deployment-ஐ நெருக்கமாகப் பார்த்தால், அது முதலில் ஒரு புதிய Pod-ஐ உருவாக்குவதையும், பிறகு ஒரு பழைய Pod-ஐ நீக்குவதையும், பிறகு மற்றொரு புதிய Pod-ஐ உருவாக்குவதையும் காணலாம். போதுமான எண்ணிக்கையிலான புதிய Pod-கள் வரும் வரை பழைய Pod-களை நிறுத்தாது, மேலும் போதுமான எண்ணிக்கையிலான பழைய Pod-கள் நிறுத்தப்படும் வரை புதிய Pod-களை உருவாக்காது. குறைந்தது 3 Pod-கள் கிடைக்கும் மற்றும் மொத்தமாக அதிகபட்சம் 4 Pod-கள் கிடைக்கும் என்பதை உறுதி செய்கிறது. 4 பிரதிகள் கொண்ட Deployment-இன் வழக்கில், Pod-களின் எண்ணிக்கை 3 முதல் 5 வரை இருக்கும்.

* உங்கள் Deployment-இன் விவரங்களைப் பெறுங்கள்:
  ```shell
  kubectl describe deployments
  ```
  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  Name:                   nginx-deployment
  Namespace:              default
  CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
  Labels:                 app=nginx
  Annotations:            deployment.kubernetes.io/revision=2
  Selector:               app=nginx
  Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
  StrategyType:           RollingUpdate
  MinReadySeconds:        0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
     Containers:
      nginx:
        Image:        nginx:1.16.1
        Port:         80/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----------------       -------
      Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
      Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
  ```
  நீங்கள் முதலில் Deployment-ஐ உருவாக்கும்போது, அது ஒரு ReplicaSet-ஐ (nginx-deployment-2035384211) உருவாக்கி நேரடியாக 3 பிரதிகளுக்கு அளவிட்டது என்பதை இங்கே காணலாம். நீங்கள் Deployment-ஐ புதுப்பித்தபோது, அது ஒரு புதிய ReplicaSet-ஐ (nginx-deployment-1564180365) உருவாக்கி அதை 1-க்கு அளவிட்டு அது வரும் வரை காத்திருந்தது. பிறகு பழைய ReplicaSet-ஐ 2-க்கு குறைத்து புதிய ReplicaSet-ஐ 2-க்கு அளவிட்டது, இதனால் எல்லா நேரத்திலும் குறைந்தது 3 Pod-கள் கிடைக்கும் மற்றும் அதிகபட்சம் 4 Pod-கள் உருவாக்கப்படும். பிறகு அதே உருளும் புதுப்பிப்பு மூலோபாயத்துடன் புதிய மற்றும் பழைய ReplicaSet-களை அளவிடுவதைத் தொடர்ந்தது. இறுதியாக, புதிய ReplicaSet-இல் 3 கிடைக்கும் பிரதிகள் இருக்கும், பழைய ReplicaSet 0-க்கு குறைக்கப்படும்.

{{< note >}}
`availableReplicas`-ன் எண்ணிக்கையை கணக்கிடும்போது Kubernetes முடிவடையும் Pod-களை கணக்கில் எடுத்துக்கொள்ளாது, இது `replicas - maxUnavailable` மற்றும் `replicas + maxSurge` இடையே இருக்க வேண்டும். இதன் விளைவாக, rollout-இன் போது எதிர்பார்த்ததை விட அதிக Pod-கள் இருப்பதை நீங்கள் கவனிக்கலாம், மேலும் முடிவடையும் Pod-களின் `terminationGracePeriodSeconds` காலாவதியாகும் வரை Deployment-ஆல் பயன்படுத்தப்படும் மொத்த வளங்கள் `replicas + maxSurge`-ஐ விட அதிகமாக இருக்கும்.
{{< /note >}}

### Rollover (பல புதுப்பிப்புகள் ஒரே நேரத்தில்)

Deployment கட்டுப்படுத்தியால் ஒரு புதிய Deployment கவனிக்கப்படும் ஒவ்வொரு முறையும், விரும்பிய Pod-களைக் கொண்டு வர ஒரு ReplicaSet உருவாக்கப்படுகிறது. Deployment புதுப்பிக்கப்பட்டால், `.spec.selector`-உடன் பொருந்தும் முத்திரைகள் கொண்ட Pod-களைக் கட்டுப்படுத்தும் ஆனால் `.spec.template`-உடன் பொருந்தாத template கொண்ட ஏற்கனவே உள்ள ReplicaSet குறைக்கப்படுகிறது. இறுதியாக, புதிய ReplicaSet `.spec.replicas`-க்கு அளவிடப்படுகிறது மற்றும் அனைத்து பழைய ReplicaSet-களும் 0-க்கு குறைக்கப்படுகின்றன.

ஏற்கனவே ஒரு rollout நடந்துகொண்டிருக்கும்போது நீங்கள் Deployment-ஐ புதுப்பித்தால், Deployment புதுப்பிப்பின்படி ஒரு புதிய ReplicaSet-ஐ உருவாக்கி அதை அளவிடத் தொடங்கும், மேலும் முன்பு அளவிடப்பட்டுக்கொண்டிருந்த ReplicaSet-ஐ மாற்றும் -- அதை பழைய ReplicaSet-களின் பட்டியலில் சேர்த்து குறைக்கத் தொடங்கும்.

எடுத்துக்காட்டாக, `nginx:1.14.2`-இன் 5 பிரதிகளை உருவாக்க ஒரு Deployment-ஐ உருவாக்குகிறீர்கள் என்று வைத்துக்கொள்வோம், ஆனால் `nginx:1.14.2`-இன் 3 பிரதிகள் மட்டுமே உருவாக்கப்பட்டிருக்கும்போது `nginx:1.16.1`-இன் 5 பிரதிகளை உருவாக்க Deployment-ஐ புதுப்பிக்கிறீர்கள். அந்த வழக்கில், Deployment உருவாக்கிய 3 `nginx:1.14.2` Pod-களை உடனடியாக நிறுத்தத் தொடங்கும், மேலும் `nginx:1.16.1` Pod-களை உருவாக்கத் தொடங்கும். திசையை மாற்றுவதற்கு முன் `nginx:1.14.2`-இன் 5 பிரதிகள் உருவாக்கப்படும் வரை காத்திருக்காது.

### முத்திரை தேர்வாளர் புதுப்பிப்புகள்

முத்திரை தேர்வாளர் புதுப்பிப்புகள் செய்வது பொதுவாக ஊக்கமளிக்கப்படாது, மேலும் உங்கள் தேர்வாளர்களை முன்கூட்டியே திட்டமிடுமாறு பரிந்துரைக்கப்படுகிறது.
Deployment-இன் முத்திரை தேர்வாளர் உருவாக்கத்திற்குப் பிறகு **மாற்ற முடியாதது**;
`kubectl patch`, `kubectl edit`, `kubectl apply` அல்லது `helm upgrade` போன்ற கருவிகள் மூலம் புதுப்பிக்க இயலாது.

நீங்கள் தேர்வாளரை மாற்ற வேண்டுமென்றால், Deployment-ஐ நீக்கி மீண்டும் உருவாக்க வேண்டும்.
மிகுந்த எச்சரிக்கையுடன் செயல்படுங்கள், பின்வரும் விளைவுகளை நீங்கள் புரிந்துகொள்வதை உறுதிசெய்யுங்கள்:

* **சேர்த்தல்:** நீங்கள் குறுகிய தேர்வாளருடன் புதிய Deployment-ஐ உருவாக்கும்போது, புதிய Deployment-க்கு பொருத்தமான Pod template-ம் **இருக்க வேண்டும்**.
  உங்களிடம் ஏற்கனவே ஒரு manifest இருந்து, தேர்வாளரை குறுக்க அந்த manifest-ஐ திருத்தினால், அந்த Deployment-க்குள் உள்ள Pod template-இன் metadata-வை திருத்தி, பொருந்துவதற்கு புதிய முத்திரைகளை சேர்க்க வேண்டும், இல்லையென்றால் API server சரிபார்ப்பு பிழையை அளிக்கும். இது _மேற்பொருந்தாத_ மாற்றமாகும்: புதிய Deployment பழைய Pod-களை (புதிய முத்திரை இல்லாதவை) "பார்க்காது", இதனால் பழைய ReplicaSet **அனாதையாகும்** மற்றும் ஒரு புதிய ReplicaSet உருவாக்கப்படும்.
* **மதிப்பு புதுப்பிப்புகள்:** தேர்வாளர் சாவியில் ஏற்கனவே உள்ள மதிப்பை மாற்றுவது (எ.கா., `v1`-இலிருந்து `v2`-க்கு) சேர்த்தலைப் போலவே அதே நடத்தையை ஏற்படுத்தும் (அனாதையாதல் மற்றும் மறுஉருவாக்கம்).
* **நீக்குதல்:** Deployment தேர்வாளரிலிருந்து ஏற்கனவே உள்ள சாவியை நீக்குவதற்கு Pod template முத்திரைகளில் எந்த மாற்றமும் தேவையில்லை. இது _மேற்பொருந்தும்_ மாற்றமாகும்: புதிய, பரந்த தேர்வாளர் பழைய Pod-களுடன் பொருந்தும். ஏற்கனவே உள்ள ReplicaSet-கள் அனாதையாகாது, புதிய ReplicaSet உருவாக்கப்படாது, ஆனால் நீக்கப்பட்ட முத்திரை ஏற்கனவே உள்ள Pod-கள் மற்றும் ReplicaSet-களில் இன்னும் இருக்கும் என்பதை கவனியுங்கள். Deployment-க்கு rollout-ஐ தூண்டுவதன் மூலம் அதை சுத்தம் செய்யலாம்.

## Deployment-ஐ பின்னோக்கி மாற்றுதல்

சில நேரங்களில், Deployment-ஐ பின்னோக்கி மாற்ற வேண்டியிருக்கலாம்; எடுத்துக்காட்டாக, Deployment நிலையானதாக இல்லை என்றால், தொடர்ச்சியான crash-கள் போன்றவை.
இயல்பாக, Deployment-இன் அனைத்து rollout வரலாறும் கணினியில் வைக்கப்பட்டிருக்கும், இதனால் நீங்கள் எப்போது வேண்டுமானாலும் பின்னோக்கி மாறலாம் (திருத்த வரலாறு வரம்பை மாற்றுவதன் மூலம் அதை மாற்றலாம்).

{{< note >}}
Deployment-இன் rollout தூண்டப்படும்போது Deployment-இன் திருத்தம் உருவாக்கப்படுகிறது. அதாவது Deployment-இன் Pod template (`.spec.template`) மாற்றப்படும்போது மட்டுமே புதிய திருத்தம் உருவாக்கப்படும், எடுத்துக்காட்டாக நீங்கள் template-இன் முத்திரைகள் அல்லது கொள்கலன் படங்களை புதுப்பித்தால். Deployment-ஐ அளவிடுதல் போன்ற பிற புதுப்பிப்புகள் Deployment திருத்தத்தை உருவாக்காது, இதனால் ஒரே நேரத்தில் கைமுறை அல்லது தானியங்கி அளவிடலை எளிதாக்கலாம்.
இதன் பொருள் என்னவென்றால், முந்தைய திருத்தத்திற்கு பின்னோக்கி மாறும்போது, Deployment-இன் Pod template பகுதி மட்டுமே பின்னோக்கி மாற்றப்படும்.
{{< /note >}}

* Deployment-ஐ புதுப்பிக்கும்போது நீங்கள் ஒரு எழுத்துப் பிழை செய்தீர்கள் என்று வைத்துக்கொள்வோம், படத்தின் பெயரை `nginx:1.16.1` என்பதற்கு பதிலாக `nginx:1.161` என வைத்ததாக:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.161
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* rollout சிக்கிக்கொள்கிறது. rollout நிலையைச் சரிபார்ப்பதன் மூலம் இதை உறுதிப்படுத்தலாம்:

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

* மேலே உள்ள rollout நிலை கண்காணிப்பை நிறுத்த Ctrl-C அழுத்தவும். சிக்கிய rollout-கள் பற்றி மேலும் தகவலுக்கு, [இங்கே மேலும் படிக்கவும்](#deployment-status).

* பழைய பிரதிகளின் எண்ணிக்கை (`nginx-deployment-1564180365` மற்றும் `nginx-deployment-2035384211`-இலிருந்து பிரதி எண்ணிக்கையை கூட்டுவது) 3 என்றும், புதிய பிரதிகளின் எண்ணிக்கை (`nginx-deployment-3066724191`-இலிருந்து) 1 என்றும் காணலாம்.

  ```shell
  kubectl get rs
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

* உருவாக்கப்பட்ட Pod-களைப் பார்க்கும்போது, புதிய ReplicaSet-ஆல் உருவாக்கப்பட்ட 1 Pod படம் இழுக்கும் சுழற்சியில் சிக்கியுள்ளது.

  ```shell
  kubectl get pods
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  {{< note >}}
  Deployment கட்டுப்படுத்தி தவறான rollout-ஐ தானாகவே நிறுத்துகிறது, மேலும் புதிய ReplicaSet-ஐ அளவிடுவதை நிறுத்துகிறது. இது நீங்கள் குறிப்பிட்ட rollingUpdate அளவுருக்களைப் (குறிப்பாக `maxUnavailable`) பொறுத்தது. Kubernetes இயல்பாக மதிப்பை 25% ஆக அமைக்கிறது.
  {{< /note >}}

* Deployment-இன் விளக்கத்தைப் பெறுங்கள்:
  ```shell
  kubectl describe deployment
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  Name:           nginx-deployment
  Namespace:      default
  CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
  Labels:         app=nginx
  Selector:       app=nginx
  Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
  StrategyType:       RollingUpdate
  MinReadySeconds:    0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
    Containers:
     nginx:
      Image:        nginx:1.161
      Port:         80/TCP
      Host Port:    0/TCP
      Environment:  <none>
      Mounts:       <none>
    Volumes:        <none>
  Conditions:
    Type           Status  Reason
    ----           ------  ------
    Available      True    MinimumReplicasAvailable
    Progressing    True    ReplicaSetUpdated
  OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
  NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
  Events:
    FirstSeen LastSeen    Count   From                    SubObjectPath   Type        Reason              Message
    --------- --------    -----   ----                    -------------   --------    ------              -------
    1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  ```

  இதைச் சரிசெய்ய, நிலையான Deployment-இன் முந்தைய திருத்தத்திற்கு பின்னோக்கி மாற வேண்டும்.

### Deployment-இன் Rollout வரலாற்றைச் சரிபார்த்தல்

rollout வரலாற்றைச் சரிபார்க்க கீழே கொடுக்கப்பட்ட படிகளைப் பின்பற்றுங்கள்:

1. முதலில், இந்த Deployment-இன் திருத்தங்களைச் சரிபார்க்கவும்:
   ```shell
   kubectl rollout history deployment/nginx-deployment
   ```
   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           <none>
   2           <none>
   3           <none>
   ```

   `CHANGE-CAUSE` உருவாக்கத்தின் போது Deployment annotation `kubernetes.io/change-cause`-இலிருந்து அதன் திருத்தங்களுக்கு நகலெடுக்கப்படுகிறது. `CHANGE-CAUSE` செய்தியை பின்வரும் வழிகளில் குறிப்பிடலாம்:

   * `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"` மூலம் Deployment-க்கு annotation சேர்த்தல்
   * வளத்தின் manifest-ஐ கைமுறையாக திருத்துதல்.
   * annotation-ஐ தானாகவே அமைக்கும் கருவிகளைப் பயன்படுத்துதல்.

   {{< note >}}
   Kubernetes-இன் பழைய பதிப்புகளில், `CHANGE-CAUSE` புலத்தை தானாக நிரப்ப kubectl கட்டளைகளுடன் `--record` flag-ஐ பயன்படுத்தலாம். இந்த flag நிராகரிக்கப்பட்டுள்ளது மற்றும் எதிர்கால வெளியீட்டில் நீக்கப்படும்.
   {{< /note >}}

2. ஒவ்வொரு திருத்தத்தின் விவரங்களைப் பார்க்க, இயக்கவும்:
   ```shell
   kubectl rollout history deployment/nginx-deployment --revision=2
   ```

   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
     Containers:
      nginx:
       Image:      nginx:1.16.1
       Port:       80/TCP
        QoS Tier:
           cpu:      BestEffort
           memory:   BestEffort
       Environment Variables:      <none>
     No volumes.
   ```

### முந்தைய திருத்தத்திற்கு பின்னோக்கி மாறுதல்
தற்போதைய பதிப்பிலிருந்து முந்தைய பதிப்பிற்கு, அதாவது பதிப்பு 2-க்கு, Deployment-ஐ பின்னோக்கி மாற்ற கீழே கொடுக்கப்பட்ட படிகளைப் பின்பற்றுங்கள்.

1. இப்போது தற்போதைய rollout-ஐ செயல்தவிர்க்கவும் முந்தைய திருத்தத்திற்கு பின்னோக்கி மாறவும் முடிவு செய்துள்ளீர்கள்:
   ```shell
   kubectl rollout undo deployment/nginx-deployment
   ```

   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   deployment.apps/nginx-deployment rolled back
   ```
   மாற்றாக, `--to-revision`-உடன் குறிப்பிட்ட திருத்தத்திற்கு பின்னோக்கி மாறலாம்:

   ```shell
   kubectl rollout undo deployment/nginx-deployment --to-revision=2
   ```

   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   deployment.apps/nginx-deployment rolled back
   ```

   rollout தொடர்பான கட்டளைகள் பற்றி மேலும் விவரங்களுக்கு, [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout) படிக்கவும்.

   Deployment இப்போது முந்தைய நிலையான திருத்தத்திற்கு பின்னோக்கி மாற்றப்பட்டுள்ளது. நீங்கள் பார்ப்பது போல், திருத்தம் 2-க்கு பின்னோக்கி மாற்றுவதற்கான `DeploymentRollback` நிகழ்வு Deployment கட்டுப்படுத்தியிலிருந்து உருவாக்கப்பட்டுள்ளது.

2. பின்னோக்கி மாற்றம் வெற்றிகரமாக இருந்ததா மற்றும் Deployment எதிர்பார்த்தபடி இயங்குகிறதா என சரிபார்க்க, இயக்கவும்:
   ```shell
   kubectl get deployment nginx-deployment
   ```

   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           30m
   ```
3. Deployment-இன் விளக்கத்தைப் பெறுங்கள்:
   ```shell
   kubectl describe deployment nginx-deployment
   ```
   வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
   ```
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
   Selector:               app=nginx
   Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
     Labels:  app=nginx
     Containers:
      nginx:
       Image:        nginx:1.16.1
       Port:         80/TCP
       Host Port:    0/TCP
       Environment:  <none>
       Mounts:       <none>
     Volumes:        <none>
   Conditions:
     Type           Status  Reason
     ----           ------  ------
     Available      True    MinimumReplicasAvailable
     Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
   Events:
     Type    Reason              Age   From                   Message
     ----    ------              ----  ----------------       -------
     Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
     Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
     Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
   ```

## Deployment-ஐ அளவிடுதல் {#scaling-a-deployment}

பின்வரும் கட்டளையைப் பயன்படுத்தி Deployment-ஐ அளவிடலாம்:

```shell
kubectl scale deployment/nginx-deployment --replicas=10
```
வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
deployment.apps/nginx-deployment scaled
```

உங்கள் கொத்தில் [horizontal Pod autoscaling](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) இயக்கப்பட்டிருந்தால், Deployment-க்கான autoscaler-ஐ அமைக்கலாம், மேலும் ஏற்கனவே உள்ள Pod-களின் CPU பயன்பாட்டின் அடிப்படையில் இயக்க வேண்டிய குறைந்தபட்ச மற்றும் அதிகபட்ச Pod-களின் எண்ணிக்கையைத் தேர்வு செய்யலாம்.

```shell
kubectl autoscale deployment/nginx-deployment --min=10 --max=15 --cpu-percent=80%
```
வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
deployment.apps/nginx-deployment scaled
```

### விகிதாசார அளவிடல்

RollingUpdate Deployment-கள் ஒரே நேரத்தில் பயன்பாட்டின் பல பதிப்புகளை இயக்குவதை ஆதரிக்கின்றன. நீங்கள் அல்லது autoscaler rollout-இன் நடுவில் (நடந்துகொண்டிருக்கும் அல்லது இடைநிறுத்தப்பட்ட) ஒரு RollingUpdate Deployment-ஐ அளவிடும்போது, Deployment கட்டுப்படுத்தி ஆபத்தைக் குறைக்க ஏற்கனவே செயலில் உள்ள ReplicaSet-களில் (Pod-கள் கொண்ட ReplicaSet-கள்) கூடுதல் பிரதிகளை சமப்படுத்துகிறது. இது *விகிதாசார அளவிடல்* என்று அழைக்கப்படுகிறது.

எடுத்துக்காட்டாக, 10 பிரதிகளுடன் ஒரு Deployment-ஐ இயக்குகிறீர்கள், [maxSurge](#max-surge)=3, மற்றும் [maxUnavailable](#max-unavailable)=2.

* உங்கள் Deployment-இல் 10 பிரதிகள் இயங்குவதை உறுதிசெய்யுங்கள்.
  ```shell
  kubectl get deploy
  ```
  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* கொத்துக்குள் இருந்து தீர்க்க முடியாத புதிய படத்திற்கு புதுப்பிக்கிறீர்கள்.
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:sometag
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* படம் புதுப்பிப்பு ReplicaSet nginx-deployment-1989198191-உடன் புதிய rollout-ஐ தொடங்குகிறது, ஆனால் நீங்கள் மேலே குறிப்பிட்ட `maxUnavailable` தேவையின் காரணமாக தடுக்கப்படுகிறது. rollout நிலையைச் சரிபார்க்கவும்:
  ```shell
  kubectl get rs
  ```
  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME                          DESIRED   CURRENT   READY     AGE
  nginx-deployment-1989198191   5         5         0         9s
  nginx-deployment-618515232    8         8         8         1m
  ```

* பிறகு Deployment-க்கு புதிய அளவிடல் கோரிக்கை வருகிறது. autoscaler Deployment பிரதிகளை 15-க்கு அதிகரிக்கிறது. Deployment கட்டுப்படுத்தி இந்த புதிய 5 பிரதிகளை எங்கு சேர்க்க வேண்டும் என்பதை முடிவு செய்ய வேண்டும். நீங்கள் விகிதாசார அளவிடலைப் பயன்படுத்தவில்லை என்றால், அனைத்து 5-ம் புதிய ReplicaSet-இல் சேர்க்கப்படும். விகிதாசார அளவிடலுடன், கூடுதல் பிரதிகளை அனைத்து ReplicaSet-களிலும் பரப்புகிறீர்கள். அதிக பிரதிகள் கொண்ட ReplicaSet-களுக்கு பெரிய விகிதங்களும், குறைவான பிரதிகள் கொண்ட ReplicaSet-களுக்கு குறைந்த விகிதங்களும் செல்லும். மீதமுள்ளவை அதிக பிரதிகள் கொண்ட ReplicaSet-க்கு சேர்க்கப்படும். பூஜ்ஜிய பிரதிகள் கொண்ட ReplicaSet-கள் அளவிடப்படாது.

எங்கள் மேலே உள்ள எடுத்துக்காட்டில், 3 பிரதிகள் பழைய ReplicaSet-க்கும் 2 பிரதிகள் புதிய ReplicaSet-க்கும் சேர்க்கப்படுகின்றன. புதிய பிரதிகள் ஆரோக்கியமாக இருக்கும் என்று கருதி, rollout செயல்முறை இறுதியாக அனைத்து பிரதிகளையும் புதிய ReplicaSet-க்கு நகர்த்த வேண்டும். இதை உறுதிப்படுத்த, இயக்கவும்:

```shell
kubectl get deploy
```

வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```
rollout நிலை ஒவ்வொரு ReplicaSet-க்கும் எவ்வாறு பிரதிகள் சேர்க்கப்பட்டன என்பதை உறுதிப்படுத்துகிறது.
```shell
kubectl get rs
```

வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## Deployment-இன் rollout-ஐ இடைநிறுத்துதல் மற்றும் மீண்டும் தொடங்குதல் {#pausing-and-resuming-a-deployment}

நீங்கள் ஒரு Deployment-ஐ புதுப்பிக்கும்போது அல்லது திட்டமிடும்போது, ஒன்று அல்லது அதற்கு மேற்பட்ட புதுப்பிப்புகளைத் தூண்டுவதற்கு முன் அந்த Deployment-க்கான rollout-களை இடைநிறுத்தலாம். அந்த மாற்றங்களைப் பயன்படுத்தத் தயாராக இருக்கும்போது, Deployment-க்கான rollout-களை மீண்டும் தொடங்குங்கள். இந்த அணுகுமுறை தேவையற்ற rollout-களைத் தூண்டாமல் இடைநிறுத்தம் மற்றும் மீண்டும் தொடங்குதலுக்கு இடையில் பல திருத்தங்களைப் பயன்படுத்த அனுமதிக்கிறது.

* எடுத்துக்காட்டாக, உருவாக்கப்பட்ட ஒரு Deployment-உடன்:

  Deployment விவரங்களைப் பெறுங்கள்:
  ```shell
  kubectl get deploy
  ```
  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```
  rollout நிலையைப் பெறுங்கள்:
  ```shell
  kubectl get rs
  ```
  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* பின்வரும் கட்டளையை இயக்குவதன் மூலம் இடைநிறுத்தவும்:
  ```shell
  kubectl rollout pause deployment/nginx-deployment
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  deployment.apps/nginx-deployment paused
  ```

* பிறகு Deployment-இன் படத்தைப் புதுப்பிக்கவும்:
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* புதிய rollout தொடங்கவில்லை என்பதை கவனியுங்கள்:
  ```shell
  kubectl rollout history deployment/nginx-deployment
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```
* ஏற்கனவே உள்ள ReplicaSet மாறவில்லை என்பதை உறுதிப்படுத்த rollout நிலையைப் பெறுங்கள்:
  ```shell
  kubectl get rs
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

* நீங்கள் விரும்பும் அளவு புதுப்பிப்புகளைச் செய்யலாம், எடுத்துக்காட்டாக, பயன்படுத்தப்படும் வளங்களைப் புதுப்பிக்கவும்:
  ```shell
  kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  deployment.apps/nginx-deployment resource requirements updated
  ```

  Deployment-ஐ இடைநிறுத்துவதற்கு முன் உள்ள ஆரம்ப நிலை அதன் செயல்பாட்டைத் தொடரும், ஆனால் Deployment rollout இடைநிறுத்தப்பட்டிருக்கும் வரை Deployment-க்கான புதிய புதுப்பிப்புகள் எந்த விளைவையும் ஏற்படுத்தாது.

* இறுதியாக, Deployment rollout-ஐ மீண்டும் தொடங்கி அனைத்து புதிய புதுப்பிப்புகளுடன் புதிய ReplicaSet வருவதைக் கவனியுங்கள்:
  ```shell
  kubectl rollout resume deployment/nginx-deployment
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  deployment.apps/nginx-deployment resumed
  ```
* rollout முடியும் வரை நிலையைக் {{< glossary_tooltip text="கவனியுங்கள்" term_id="watch" >}}.
  ```shell
  kubectl get rs --watch
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   2         2         2         2m
  nginx-3926361531   2         2         0         6s
  nginx-3926361531   2         2         1         18s
  nginx-2142116321   1         2         2         2m
  nginx-2142116321   1         2         2         2m
  nginx-3926361531   3         2         1         18s
  nginx-3926361531   3         2         1         18s
  nginx-2142116321   1         1         1         2m
  nginx-3926361531   3         3         1         18s
  nginx-3926361531   3         3         2         19s
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         20s
  ```
* சமீபத்திய rollout-இன் நிலையைப் பெறுங்கள்:
  ```shell
  kubectl get rs
  ```

  வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```
{{< note >}}
இடைநிறுத்தப்பட்ட Deployment-ஐ நீங்கள் மீண்டும் தொடங்கும் வரை பின்னோக்கி மாற்ற இயலாது.
{{< /note >}}

## Deployment நிலை {#deployment-status}

ஒரு Deployment அதன் வாழ்க்கைச் சுழற்சியின் போது பல்வேறு நிலைகளுக்கு நுழைகிறது. புதிய ReplicaSet-ஐ வெளியிடும்போது அது [முன்னேறுகிறது](#progressing-deployment), அது [நிறைவடையும்](#complete-deployment), அல்லது [முன்னேறத் தவறும்](#failed-deployment).

### முன்னேறும் Deployment {#progressing-deployment}

பின்வரும் பணிகளில் ஒன்று செய்யப்படும்போது Kubernetes ஒரு Deployment-ஐ _முன்னேறுகிறது_ என்று குறிக்கிறது:

* Deployment புதிய ReplicaSet-ஐ உருவாக்குகிறது.
* Deployment அதன் புதிய ReplicaSet-ஐ அளவிடுகிறது.
* Deployment அதன் பழைய ReplicaSet(கள்)-ஐ குறைக்கிறது.
* புதிய Pod-கள் தயாராக அல்லது கிடைக்கும் நிலையில் ஆகின்றன (குறைந்தது [MinReadySeconds](#min-ready-seconds) நேரம் தயாராக இருந்தால்).

rollout "முன்னேறுகிறது" ஆகும்போது, Deployment கட்டுப்படுத்தி Deployment-இன் `.status.conditions`-க்கு பின்வரும் பண்புகளுடன் ஒரு நிபந்தனையைச் சேர்க்கிறது:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetCreated` | `reason: FoundNewReplicaSet` | `reason: ReplicaSetUpdated`

`kubectl rollout status`-ஐ பயன்படுத்தி Deployment-இன் முன்னேற்றத்தைக் கண்காணிக்கலாம்.

### நிறைவடைந்த Deployment {#complete-deployment}

பின்வரும் பண்புகளைக் கொண்டிருக்கும்போது Kubernetes ஒரு Deployment-ஐ _நிறைவடைந்தது_ என்று குறிக்கிறது:

* Deployment-உடன் தொடர்புடைய அனைத்து பிரதிகளும் நீங்கள் குறிப்பிட்ட சமீபத்திய பதிப்பிற்கு புதுப்பிக்கப்பட்டுள்ளன, அதாவது நீங்கள் கோரிய எந்த புதுப்பிப்புகளும் நிறைவடைந்துள்ளன.
* Deployment-உடன் தொடர்புடைய அனைத்து பிரதிகளும் கிடைக்கின்றன.
* Deployment-க்கான பழைய பிரதிகள் எதுவும் இயங்கவில்லை.

rollout "நிறைவடைந்தது" ஆகும்போது, Deployment கட்டுப்படுத்தி Deployment-இன் `.status.conditions`-க்கு பின்வரும் பண்புகளுடன் ஒரு நிபந்தனையை அமைக்கிறது:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetAvailable`

புதிய rollout தொடங்கும் வரை இந்த `Progressing` நிபந்தனை `"True"` நிலை மதிப்பைத் தக்கவைக்கும். பிரதிகளின் கிடைக்கும் தன்மை மாறினாலும் (அது `Available` நிபந்தனையை மாறாக பாதிக்கும்) நிபந்தனை நிலைத்திருக்கும்.

`kubectl rollout status`-ஐ பயன்படுத்தி Deployment நிறைவடைந்ததா என சரிபார்க்கலாம். rollout வெற்றிகரமாக நிறைவடைந்தால், `kubectl rollout status` பூஜ்ஜிய வெளியேற்ற குறியீட்டை அளிக்கும்.

```shell
kubectl rollout status deployment/nginx-deployment
```
வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```
மற்றும் `kubectl rollout`-இன் வெளியேற்ற நிலை 0 (வெற்றி):
```shell
echo $?
```
```
0
```

### தோல்வியடைந்த Deployment {#failed-deployment}

உங்கள் Deployment அதன் புதிய ReplicaSet-ஐ வரிசைப்படுத்த முயற்சிக்கும்போது நிறைவடையாமல் சிக்கலாம். பின்வரும் காரணிகளால் இது நிகழலாம்:

* போதுமான ஒதுக்கீடு இல்லை
* Readiness probe தோல்விகள்
* படம் இழுக்கும் பிழைகள்
* போதுமான அனுமதிகள் இல்லை
* வரம்பு வரையறைகள்
* பயன்பாட்டு இயக்க நேர தவறான உள்ளமைவு

இந்த நிலையைக் கண்டறிய ஒரு வழி, உங்கள் Deployment spec-இல் ஒரு காலக்கெடு அளவுருவைக் குறிப்பிடுவது: ([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` என்பது Deployment முன்னேற்றம் நிலைகுலைந்துள்ளது என்று (Deployment நிலையில்) Deployment கட்டுப்படுத்தி குறிப்பிடுவதற்கு முன் காத்திருக்கும் நொடிகளின் எண்ணிக்கையைக் குறிக்கிறது.

Deployment-க்கு 10 நிமிடங்களுக்குப் பிறகு rollout-இன் முன்னேற்ற இல்லாமையை கட்டுப்படுத்தி அறிக்கை செய்ய `progressDeadlineSeconds`-உடன் spec-ஐ அமைக்கும் பின்வரும் `kubectl` கட்டளை:

```shell
kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
deployment.apps/nginx-deployment patched
```
காலக்கெடு கடந்தவுடன், Deployment கட்டுப்படுத்தி Deployment-இன் `.status.conditions`-க்கு பின்வரும் பண்புகளுடன் ஒரு DeploymentCondition-ஐ சேர்க்கிறது:

* `type: Progressing`
* `status: "False"`
* `reason: ProgressDeadlineExceeded`

இந்த நிபந்தனை `ReplicaSetCreateError` போன்ற காரணங்களால் முன்னதாகவே தோல்வியடையலாம், அப்போது `"False"` நிலை மதிப்பு அமைக்கப்படும்.
மேலும், Deployment rollout நிறைவடைந்தவுடன் காலக்கெடு கணக்கில் எடுக்கப்படாது.

நிலை நிபந்தனைகள் பற்றி மேலும் தகவலுக்கு [Kubernetes API மரபுகளை](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) பார்க்கவும்.

{{< note >}}
நிலைகுலைந்த Deployment மீது `reason: ProgressDeadlineExceeded` நிலை நிபந்தனையை அறிக்கை செய்வதைத் தவிர Kubernetes வேறு எந்த நடவடிக்கையும் எடுக்காது. உயர் நிலை ஒருங்கிணைப்பாளர்கள் இதை பயன்படுத்திக்கொண்டு அதற்கேற்ப செயல்படலாம், எடுத்துக்காட்டாக, Deployment-ஐ அதன் முந்தைய பதிப்பிற்கு பின்னோக்கி மாற்றுதல்.
{{< /note >}}

{{< note >}}
Deployment rollout-ஐ இடைநிறுத்தினால், Kubernetes உங்கள் குறிப்பிட்ட காலக்கெடுக்கு எதிராக முன்னேற்றத்தைச் சரிபார்க்காது. rollout-இன் நடுவில் Deployment rollout-ஐ பாதுகாப்பாக இடைநிறுத்தி, காலக்கெடு மீறல் நிபந்தனையைத் தூண்டாமல் மீண்டும் தொடங்கலாம்.
{{< /note >}}

உங்கள் Deployment-களில் தற்காலிக பிழைகளை அனுபவிக்கலாம், நீங்கள் அமைத்த குறைந்த காலக்கெடு காரணமாக அல்லது தற்காலிகமாக கருதப்படும் வேறு எந்த வகையான பிழை காரணமாகவும். எடுத்துக்காட்டாக, போதுமான ஒதுக்கீடு இல்லை என்று வைத்துக்கொள்வோம். Deployment-ஐ விவரித்தால் பின்வரும் பகுதியைக் காணலாம்:

```shell
kubectl describe deployment nginx-deployment
```
வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

`kubectl get deployment nginx-deployment -o yaml` இயக்கினால், Deployment நிலை பின்வருவதைப் போன்றிருக்கும்:

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

இறுதியாக, Deployment முன்னேற்ற காலக்கெடு மீறப்பட்டவுடன், Kubernetes நிலையையும் Progressing நிபந்தனையின் காரணத்தையும் புதுப்பிக்கிறது:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

உங்கள் Deployment-ஐ குறைத்து, இயங்கும் பிற கட்டுப்படுத்திகளை குறைத்து, அல்லது உங்கள் Namespace-இல் ஒதுக்கீட்டை அதிகரித்து போதுமான ஒதுக்கீடு பிரச்சனையை தீர்க்கலாம். ஒதுக்கீடு நிபந்தனைகளை பூர்த்தி செய்து Deployment கட்டுப்படுத்தி Deployment rollout-ஐ நிறைவு செய்தால், வெற்றிகரமான நிபந்தனையுடன் (`status: "True"` மற்றும் `reason: NewReplicaSetAvailable`) Deployment-இன் நிலை புதுப்பிக்கப்படுவதைக் காணலாம்.

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`type: Available` `status: "True"` உடன் என்றால் உங்கள் Deployment-க்கு குறைந்தபட்ச கிடைக்கும் தன்மை உள்ளது. குறைந்தபட்ச கிடைக்கும் தன்மை deployment strategy-யில் குறிப்பிடப்பட்ட அளவுருக்களால் தீர்மானிக்கப்படுகிறது. `type: Progressing` `status: "True"` உடன் என்றால் உங்கள் Deployment rollout-இன் நடுவில் உள்ளது மற்றும் முன்னேறுகிறது அல்லது அதன் முன்னேற்றத்தை வெற்றிகரமாக நிறைவு செய்துள்ளது மற்றும் குறைந்தபட்ச தேவையான புதிய பிரதிகள் கிடைக்கின்றன (குறிப்பிட்ட விவரங்களுக்கு நிபந்தனையின் காரணத்தைப் பார்க்கவும் - எங்கள் வழக்கில் `reason: NewReplicaSetAvailable` என்றால் Deployment நிறைவடைந்துள்ளது).

`kubectl rollout status`-ஐ பயன்படுத்தி Deployment முன்னேறத் தவறியுள்ளதா என சரிபார்க்கலாம். Deployment முன்னேற்ற காலக்கெடையை மீறியிருந்தால் `kubectl rollout status` பூஜ்ஜியமற்ற வெளியேற்ற குறியீட்டை அளிக்கும்.

```shell
kubectl rollout status deployment/nginx-deployment
```
வெளியீடு பின்வருவதைப் போன்றிருக்கும்:
```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```
மற்றும் `kubectl rollout`-இன் வெளியேற்ற நிலை 1 (பிழையைக் குறிக்கிறது):
```shell
echo $?
```
```
1
```

### தோல்வியடைந்த deployment மீது செயல்படுதல்

நிறைவடைந்த Deployment-க்கு பொருந்தும் அனைத்து நடவடிக்கைகளும் தோல்வியடைந்த Deployment-க்கும் பொருந்தும். நீங்கள் அதை அளவிடலாம், முந்தைய திருத்தத்திற்கு பின்னோக்கி மாறலாம், அல்லது Deployment Pod template-இல் பல மாற்றங்களைப் பயன்படுத்த வேண்டும் என்றால் இடைநிறுத்தலாம்.

## சுத்தம் செய்தல் கொள்கை {#clean-up-policy}

இந்த Deployment-க்கு எத்தனை பழைய ReplicaSet-களை வைத்திருக்க விரும்புகிறீர்கள் என்பதைக் குறிப்பிட Deployment-இல் `.spec.revisionHistoryLimit` புலத்தை அமைக்கலாம். மீதமுள்ளவை பின்னணியில் குப்பை சேகரிக்கப்படும். இயல்பாக, இது 10 ஆகும்.

{{< note >}}
இந்தப் புலத்தை வெளிப்படையாக 0 ஆக அமைப்பது உங்கள் Deployment-இன் அனைத்து வரலாற்றையும் சுத்தம் செய்வதில் விளையும், எனவே அந்த Deployment பின்னோக்கி மாற இயலாது.
{{< /note >}}

சுத்தம் செய்தல் Deployment [நிறைவு நிலையை](/docs/concepts/workloads/controllers/deployment/#complete-deployment) அடைந்த **பிறகு** மட்டுமே தொடங்கும்.
`.spec.revisionHistoryLimit`-ஐ 0 ஆக அமைத்தாலும், Kubernetes பழையதை நீக்குவதற்கு முன் புதிய ReplicaSet-ஐ உருவாக்குவதை எந்த rollout-ம் தூண்டும்.

பூஜ்ஜியமற்ற திருத்த வரலாறு வரம்புடன் கூட, நீங்கள் உள்ளமைக்கும் வரம்பை விட அதிகமான ReplicaSet-கள் இருக்கலாம். எடுத்துக்காட்டாக, Pod-கள் crash looping செய்தால், காலப்போக்கில் பல rolling update நிகழ்வுகள் தூண்டப்பட்டால், Deployment ஒருபோதும் நிறைவு நிலையை அடையாததால் `.spec.revisionHistoryLimit`-ஐ விட அதிகமான ReplicaSet-கள் இருக்கலாம்.

## Canary Deployment

பயனர்கள் அல்லது சேவையகங்களின் துணைக்குழுவிற்கு வெளியீடுகளை வெளியிட விரும்பினால், [வளங்களை நிர்வகித்தல்](/docs/concepts/workloads/management/#canary-deployments)-இல் விவரிக்கப்பட்ட canary pattern-ஐ பின்பற்றி, ஒவ்வொரு வெளியீட்டிற்கும் ஒன்றாக பல Deployment-களை உருவாக்கலாம்.

## Deployment Spec எழுதுதல் {#writing-a-deployment-spec}

மற்ற அனைத்து Kubernetes உள்ளமைவுகளைப் போலவே, ஒரு Deployment-க்கு `.apiVersion`, `.kind` மற்றும் `.metadata` புலங்கள் தேவை.
உள்ளமைவு கோப்புகளுடன் பணிபுரிவது பற்றிய பொதுவான தகவலுக்கு, [பயன்பாடுகளை வரிசைப்படுத்துதல்](/docs/tasks/run-application/run-stateless-application-deployment/), கொள்கலன்களை உள்ளமைத்தல், மற்றும் [kubectl-ஐ பயன்படுத்தி வளங்களை நிர்வகித்தல்](/docs/concepts/overview/working-with-objects/object-management/) ஆவணங்களைப் பார்க்கவும்.

கட்டுப்பாட்டு தளம் Deployment-க்கான புதிய Pod-களை உருவாக்கும்போது, Deployment-இன் `.metadata.name` அந்த Pod-களுக்கு பெயரிடுவதற்கான அடிப்படையின் ஒரு பகுதியாகும். Deployment-இன் பெயர் செல்லுபடியாகும் [DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) மதிப்பாக இருக்க வேண்டும், ஆனால் இது Pod hostname-களுக்கு எதிர்பாராத முடிவுகளை உருவாக்கலாம். சிறந்த இணக்கத்தன்மைக்கு, பெயர் மிகவும் கட்டுப்படுத்தப்பட்ட [DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names) விதிகளைப் பின்பற்ற வேண்டும்.

Deployment-க்கு [`.spec` பகுதியும்](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) தேவை.

### Pod Template

`.spec.template` மற்றும் `.spec.selector` `.spec`-இன் ஒரே தேவையான புலங்களாகும்.

`.spec.template` என்பது ஒரு [Pod template](/docs/concepts/workloads/pods/#pod-templates) ஆகும். இது ஒரு {{< glossary_tooltip text="Pod" term_id="pod" >}}-ஐப் போலவே அதே schema-வைக் கொண்டுள்ளது, ஆனால் அது உள்ளமைக்கப்பட்டுள்ளது மற்றும் `apiVersion` அல்லது `kind` இல்லை.

Pod-க்கான தேவையான புலங்களுக்கு கூடுதலாக, Deployment-இல் உள்ள Pod template பொருத்தமான முத்திரைகள் மற்றும் பொருத்தமான மறுதொடக்க கொள்கையைக் குறிப்பிட வேண்டும். முத்திரைகளுக்கு, மற்ற கட்டுப்படுத்திகளுடன் மேற்பொருந்தாமல் இருப்பதை உறுதிசெய்யுங்கள். [தேர்வாளர்](#selector) பார்க்கவும்.

[`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) `Always`-க்கு சமமாக மட்டுமே அனுமதிக்கப்படும், குறிப்பிடப்படாவிட்டால் இது இயல்புநிலையாகும்.

### பிரதிகள் {#replicas}

`.spec.replicas` என்பது விரும்பிய Pod-களின் எண்ணிக்கையைக் குறிப்பிடும் விருப்பத் புலமாகும். இது இயல்பாக 1 ஆகும்.

நீங்கள் கைமுறையாக Deployment-ஐ அளவிட்டால், எடுத்துக்காட்டாக `kubectl scale deployment deployment --replicas=X` மூலம், பிறகு manifest-ஐ அடிப்படையாகக் கொண்டு அந்த Deployment-ஐ புதுப்பித்தால் (எடுத்துக்காட்டாக: `kubectl apply -f deployment.yaml` இயக்குவதன் மூலம்), அந்த manifest-ஐ பயன்படுத்துவது நீங்கள் முன்பு செய்த கைமுறை அளவிடலை மேலெழுதும்.

[HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (அல்லது horizontal scaling-க்கான ஒத்த API) Deployment-க்கான அளவிடலை நிர்வகிக்கிறது என்றால், `.spec.replicas`-ஐ அமைக்க வேண்டாம்.

அதற்கு பதிலாக, Kubernetes {{< glossary_tooltip text="கட்டுப்பாட்டு தளம்" term_id="control-plane" >}} `.spec.replicas` புலத்தை தானாக நிர்வகிக்க அனுமதியுங்கள்.

### தேர்வாளர் {#selector}

`.spec.selector` என்பது இந்த Deployment-ஆல் குறிவைக்கப்படும் Pod-களுக்கான [முத்திரை தேர்வாளரை](/docs/concepts/overview/working-with-objects/labels/) குறிப்பிடும் தேவையான புலமாகும்.

`.spec.selector` `.spec.template.metadata.labels`-உடன் பொருந்த வேண்டும், இல்லையென்றால் API-ஆல் நிராகரிக்கப்படும்.

API பதிப்பு `apps/v1`-இல், `.spec.selector` மற்றும் `.metadata.labels` அமைக்கப்படாவிட்டால் `.spec.template.metadata.labels`-க்கு இயல்புநிலையாகாது. எனவே அவை வெளிப்படையாக அமைக்கப்பட வேண்டும். `apps/v1`-இல் Deployment உருவாக்கத்திற்குப் பிறகு `.spec.selector` மாற்ற முடியாததும் என்பதை கவனியுங்கள்.

அவற்றின் template `.spec.template`-இலிருந்து வேறுபட்டிருந்தால் அல்லது அத்தகைய Pod-களின் மொத்த எண்ணிக்கை `.spec.replicas`-ஐ மீறினால், தேர்வாளருடன் பொருந்தும் முத்திரைகள் கொண்ட Pod-களை Deployment நிறுத்தலாம். Pod-களின் எண்ணிக்கை விரும்பிய எண்ணிக்கையை விட குறைவாக இருந்தால் `.spec.template`-உடன் புதிய Pod-களைக் கொண்டு வரும்.

{{< note >}}
இந்த தேர்வாளருடன் பொருந்தும் முத்திரைகள் கொண்ட பிற Pod-களை நேரடியாகவோ, மற்றொரு Deployment உருவாக்குவதன் மூலமோ, அல்லது ReplicaSet அல்லது ReplicationController போன்ற மற்றொரு கட்டுப்படுத்தியை உருவாக்குவதன் மூலமோ நீங்கள் உருவாக்கக் கூடாது. அப்படிச் செய்தால், முதல் Deployment இந்த பிற Pod-களையும் தான் உருவாக்கியதாகக் கருதும். Kubernetes இதைச் செய்வதை உங்களைத் தடுக்காது.
{{< /note >}}

மேற்பொருந்தும் தேர்வாளர்கள் கொண்ட பல கட்டுப்படுத்திகள் இருந்தால், கட்டுப்படுத்திகள் ஒன்றுக்கொன்று முரண்பட்டு சரியாக செயல்படாது.

### மூலோபாயம் {#strategy}

`.spec.strategy` பழைய Pod-களை புதிய Pod-களால் மாற்றப் பயன்படுத்தப்படும் மூலோபாயத்தைக் குறிப்பிடுகிறது.
`.spec.strategy.type` "Recreate" அல்லது "RollingUpdate" ஆக இருக்கலாம். "RollingUpdate" இயல்புநிலை மதிப்பாகும்.

#### Recreate Deployment

`.spec.strategy.type==Recreate` எனில், புதியவை உருவாக்கப்படுவதற்கு முன் ஏற்கனவே உள்ள அனைத்து Pod-களும் நிறுத்தப்படும்.

{{< note >}}
மேம்படுத்தல்களுக்கு உருவாக்கத்திற்கு முன் Pod நிறுத்தத்தை மட்டுமே இது உத்தரவாதம் செய்கிறது. நீங்கள் ஒரு Deployment-ஐ மேம்படுத்தினால், பழைய திருத்தத்தின் அனைத்து Pod-களும் உடனடியாக நிறுத்தப்படும். புதிய திருத்தத்தின் எந்த Pod-ம் உருவாக்கப்படுவதற்கு முன் வெற்றிகரமான நீக்கம் காத்திருக்கப்படும். நீங்கள் கைமுறையாக ஒரு Pod-ஐ நீக்கினால், வாழ்க்கைச் சுழற்சி ReplicaSet-ஆல் கட்டுப்படுத்தப்படும், மேலும் மாற்றீடு உடனடியாக உருவாக்கப்படும் (பழைய Pod இன்னும் Terminating நிலையில் இருந்தாலும்). உங்கள் Pod-களுக்கு "அதிகபட்சம்" உத்தரவாதம் தேவைப்பட்டால், [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)-ஐ பயன்படுத்துவதைக் கருத்தில் கொள்ளுங்கள்.
{{< /note >}}

#### உருளும் புதுப்பிப்பு Deployment {#rolling-update-deployment}

`.spec.strategy.type==RollingUpdate` எனில், Deployment Pod-களை உருளும் புதுப்பிப்பு முறையில் (பழைய ReplicaSet-களை படிப்படியாக குறைத்து புதியதை அளவிடுதல்) புதுப்பிக்கிறது. உருளும் புதுப்பிப்பு செயல்முறையைக் கட்டுப்படுத்த `maxUnavailable` மற்றும் `maxSurge`-ஐ குறிப்பிடலாம்.

##### Max Unavailable {#max-unavailable}

`.spec.strategy.rollingUpdate.maxUnavailable` என்பது புதுப்பிப்பு செயல்முறையின் போது கிடைக்காத Pod-களின் அதிகபட்ச எண்ணிக்கையைக் குறிப்பிடும் விருப்பத் புலமாகும். மதிப்பு ஒரு முழு எண்ணாக (எடுத்துக்காட்டாக, 5) அல்லது விரும்பிய Pod-களின் சதவீதமாக (எடுத்துக்காட்டாக, 10%) இருக்கலாம். சதவீதத்திலிருந்து முழு எண் கீழ்நோக்கி வட்டமிடுவதன் மூலம் கணக்கிடப்படுகிறது. `.spec.strategy.rollingUpdate.maxSurge` 0 ஆக இருந்தால் மதிப்பு 0 ஆக இருக்க முடியாது. இயல்புநிலை மதிப்பு 25% ஆகும்.

எடுத்துக்காட்டாக, இந்த மதிப்பு 30% ஆக அமைக்கப்பட்டிருக்கும்போது, உருளும் புதுப்பிப்பு தொடங்கும்போது பழைய ReplicaSet உடனடியாக விரும்பிய Pod-களின் 70%-க்கு குறைக்கப்படலாம். புதிய Pod-கள் தயாரானவுடன், பழைய ReplicaSet மேலும் குறைக்கப்படலாம், பின்னர் புதிய ReplicaSet அளவிடப்படும், புதுப்பிப்பின் போது எல்லா நேரத்திலும் கிடைக்கும் மொத்த Pod-களின் எண்ணிக்கை விரும்பிய Pod-களின் குறைந்தது 70% ஆக இருப்பதை உறுதி செய்கிறது.

##### Max Surge {#max-surge}

`.spec.strategy.rollingUpdate.maxSurge` என்பது விரும்பிய Pod-களின் எண்ணிக்கைக்கு மேல் உருவாக்கக்கூடிய Pod-களின் அதிகபட்ச எண்ணிக்கையைக் குறிப்பிடும் விருப்பத் புலமாகும். மதிப்பு ஒரு முழு எண்ணாக (எடுத்துக்காட்டாக, 5) அல்லது விரும்பிய Pod-களின் சதவீதமாக (எடுத்துக்காட்டாக, 10%) இருக்கலாம். `maxUnavailable` 0 ஆக இருந்தால் மதிப்பு 0 ஆக இருக்க முடியாது. சதவீதத்திலிருந்து முழு எண் மேல்நோக்கி வட்டமிடுவதன் மூலம் கணக்கிடப்படுகிறது. இயல்புநிலை மதிப்பு 25% ஆகும்.

எடுத்துக்காட்டாக, இந்த மதிப்பு 30% ஆக அமைக்கப்பட்டிருக்கும்போது, உருளும் புதுப்பிப்பு தொடங்கும்போது புதிய ReplicaSet உடனடியாக அளவிடப்படலாம், இதனால் பழைய மற்றும் புதிய Pod-களின் மொத்த எண்ணிக்கை விரும்பிய Pod-களின் 130%-ஐ மீறாது. பழைய Pod-கள் நிறுத்தப்பட்டவுடன், புதிய ReplicaSet மேலும் அளவிடப்படலாம், புதுப்பிப்பின் போது எந்த நேரத்திலும் இயங்கும் மொத்த Pod-களின் எண்ணிக்கை விரும்பிய Pod-களின் அதிகபட்சம் 130% ஆக இருப்பதை உறுதி செய்கிறது.

`maxUnavailable` மற்றும் `maxSurge`-ஐ பயன்படுத்தும் சில உருளும் புதுப்பிப்பு Deployment எடுத்துக்காட்டுகள் இங்கே:

{{< tabs name="tab_with_md" >}}
{{% tab name="Max Unavailable" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
 ```

{{% /tab %}}
{{% tab name="Max Surge" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
 ```

{{% /tab %}}
{{% tab name="Hybrid" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
 ```

{{% /tab %}}
{{< /tabs >}}

### Progress Deadline Seconds {#progress-deadline-seconds}

`.spec.progressDeadlineSeconds` என்பது Deployment [முன்னேறத் தவறியுள்ளது](#failed-deployment) என்று கணினி அறிக்கை செய்வதற்கு முன் உங்கள் Deployment முன்னேற காத்திருக்க விரும்பும் நொடிகளின் எண்ணிக்கையைக் குறிப்பிடும் விருப்பத் புலமாகும் - வளத்தின் நிலையில் `type: Progressing`, `status: "False"` மற்றும் `reason: ProgressDeadlineExceeded` நிபந்தனையாக வெளிப்படுத்தப்படும். Deployment கட்டுப்படுத்தி Deployment-ஐ மீண்டும் முயற்சிக்கும். இது இயல்பாக 600 ஆகும். எதிர்காலத்தில், தானியங்கி பின்னோக்கி மாற்றம் செயல்படுத்தப்பட்டவுடன், Deployment கட்டுப்படுத்தி அத்தகைய நிபந்தனையைக் கவனிக்கும்போதே Deployment-ஐ பின்னோக்கி மாற்றும்.

குறிப்பிடப்பட்டால், இந்தப் புலம் `.spec.minReadySeconds`-ஐ விட அதிகமாக இருக்க வேண்டும்.

### Min Ready Seconds {#min-ready-seconds}

`.spec.minReadySeconds` என்பது புதிதாக உருவாக்கப்பட்ட Pod-இன் எந்த கொள்கலனும் crash ஆகாமல் தயாராக இருக்க வேண்டிய குறைந்தபட்ச நொடிகளின் எண்ணிக்கையைக் குறிப்பிடும் விருப்பத் புலமாகும், அது கிடைக்கும் நிலையில் கருதப்பட. இது இயல்பாக 0 ஆகும் (Pod தயாரானவுடன் கிடைக்கும் நிலையில் கருதப்படும்). Pod எப்போது தயாராகக் கருதப்படும் என்பதை அறிய, [கொள்கலன் ஆய்வுகள்](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) பார்க்கவும்.

### நிறுத்தப்படும் Pod-கள் {#terminating-pods}

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

`DeploymentReplicaSetTerminatingReplicas` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) [API server](/docs/reference/command-line-tools-reference/kube-apiserver/) மற்றும் [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)-இல் இயக்கப்பட்டிருந்தால் மட்டுமே நிறுத்தப்படும் Pod-களைக் காணலாம்.

நீக்கம் அல்லது குறைப்பு காரணமாக நிறுத்தப்படும் Pod-கள் நிறுத்தப்பட நீண்ட நேரம் ஆகலாம், அந்த காலகட்டத்தில் கூடுதல் வளங்களை பயன்படுத்தலாம். இதன் விளைவாக, அனைத்து Pod-களின் மொத்த எண்ணிக்கை தற்காலிகமாக `.spec.replicas`-ஐ மீறலாம். Deployment-இன் `.status.terminatingReplicas` புலத்தைப் பயன்படுத்தி நிறுத்தப்படும் Pod-களைக் கண்காணிக்கலாம்.

### திருத்த வரலாறு வரம்பு {#revision-history-limit}

Deployment-இன் திருத்த வரலாறு அது கட்டுப்படுத்தும் ReplicaSet-களில் சேமிக்கப்படுகிறது.

`.spec.revisionHistoryLimit` என்பது பின்னோக்கி மாற்றத்தை அனுமதிக்க வைத்திருக்க வேண்டிய பழைய ReplicaSet-களின் எண்ணிக்கையைக் குறிப்பிடும் விருப்பத் புலமாகும். இந்த பழைய ReplicaSet-கள் `etcd`-இல் வளங்களை பயன்படுத்துகின்றன மற்றும் `kubectl get rs`-இன் வெளியீட்டை நிரப்புகின்றன. ஒவ்வொரு Deployment திருத்தத்தின் உள்ளமைவும் அதன் ReplicaSet-களில் சேமிக்கப்படுகிறது; எனவே, பழைய ReplicaSet நீக்கப்பட்டவுடன், அந்த Deployment திருத்தத்திற்கு பின்னோக்கி மாறும் திறனை இழக்கிறீர்கள். இயல்பாக, 10 பழைய ReplicaSet-கள் வைக்கப்படும், இருப்பினும் அதன் சிறந்த மதிப்பு புதிய Deployment-களின் அதிர்வெண் மற்றும் நிலைத்தன்மையைப் பொறுத்தது.

மேலும் குறிப்பாக, இந்தப் புலத்தை பூஜ்ஜியமாக அமைப்பது 0 பிரதிகள் கொண்ட அனைத்து பழைய ReplicaSet-களும் சுத்தம் செய்யப்படும் என்பதைக் குறிக்கிறது. இந்த வழக்கில், புதிய Deployment rollout-ஐ செயல்தவிர்க்க இயலாது, ஏனெனில் அதன் திருத்த வரலாறு சுத்தம் செய்யப்பட்டுள்ளது.

### இடைநிறுத்தப்பட்டது {#paused}

`.spec.paused` என்பது Deployment-ஐ இடைநிறுத்துவதற்கும் மீண்டும் தொடங்குவதற்குமான விருப்ப boolean புலமாகும். இடைநிறுத்தப்பட்ட Deployment-க்கும் இடைநிறுத்தப்படாத Deployment-க்கும் இடையிலான ஒரே வேறுபாடு என்னவென்றால், இடைநிறுத்தப்பட்ட Deployment-இன் PodTemplateSpec-இல் ஏற்படும் எந்த மாற்றங்களும் இடைநிறுத்தப்பட்டிருக்கும் வரை புதிய rollout-களை தூண்டாது. Deployment உருவாக்கப்படும்போது இயல்பாக இடைநிறுத்தப்படாது.

## {{% heading "whatsnext" %}}

* [Pod-கள்](/docs/concepts/workloads/pods) பற்றி மேலும் அறியுங்கள்.
* [Deployment-ஐ பயன்படுத்தி நிலையற்ற பயன்பாட்டை இயக்குங்கள்](/docs/tasks/run-application/run-stateless-application-deployment/).
* Deployment API-ஐ புரிந்துகொள்ள {{< api-reference page="workload-resources/deployment-v1" >}} படிக்கவும்.
* [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) பற்றி படிக்கவும் மற்றும் சீர்குலைவுகளின் போது பயன்பாட்டு கிடைக்கும் தன்மையை நிர்வகிக்க அதை எவ்வாறு பயன்படுத்தலாம் என்பதை அறியுங்கள்.
* kubectl-ஐ பயன்படுத்தி [Deployment உருவாக்குங்கள்](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/).
