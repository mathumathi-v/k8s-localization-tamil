---
title: பணிச்சுமைகளை தானியங்கி அளவிடல்
description: >-
  தானியங்கி அளவிடல் மூலம், உங்கள் பணிச்சுமைகளை தானாகவே புதுப்பிக்கலாம். இது உங்கள் கொத்தை வளப் பயன்பாட்டு மாற்றங்களுக்கு மிகவும் நெகிழ்வாகவும் திறமையாகவும் பதிலளிக்க அனுமதிக்கிறது.
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes-இல், தற்போதைய வள தேவைகளின் அடிப்படையில் ஒரு பணிச்சுமையை _அளவிட_ முடியும்.
இது உங்கள் கொத்தை வளப் பயன்பாட்டு மாற்றங்களுக்கு மிகவும் நெகிழ்வாகவும் திறமையாகவும் பதிலளிக்க அனுமதிக்கிறது.

ஒரு பணிச்சுமையை அளவிடும்போது, அந்த பணிச்சுமையால் நிர்வகிக்கப்படும் பிரதிகளின் எண்ணிக்கையை அதிகரிக்கவோ குறைக்கவோ, அல்லது பிரதிகளுக்கு கிடைக்கும் வளங்களை இடத்திலேயே சரிசெய்யவோ முடியும்.

முதல் முறை _கிடைமட்ட அளவிடல்_ (horizontal scaling) என்றும், இரண்டாவது முறை _செங்குத்து அளவிடல்_ (vertical scaling) என்றும் அழைக்கப்படுகிறது.

உங்கள் பயன்பாட்டு வழக்கைப் பொறுத்து, பணிச்சுமைகளை கைமுறையாகவும் தானியங்கியாகவும் அளவிட முடியும்.

<!-- body -->

## பணிச்சுமைகளை கைமுறையாக அளவிடல்

Kubernetes, பணிச்சுமைகளை _கைமுறையாக அளவிடுவதை_ ஆதரிக்கிறது. `kubectl` CLI மூலம் கிடைமட்ட அளவிடல் செய்யலாம்.
செங்குத்து அளவிடலுக்கு, உங்கள் பணிச்சுமையின் வள வரையறையை _patch_ செய்ய வேண்டும்.

இரு உத்திகளுக்கும் எடுத்துக்காட்டுகள் கீழே காணலாம்:

- **கிடைமட்ட அளவிடல்**: [உங்கள் பயன்பாட்டின் பல நிகழ்வுகளை இயக்குதல்](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **செங்குத்து அளவிடல்**: [கொள்கலன்களுக்கு ஒதுக்கப்பட்ட CPU மற்றும் நினைவக வளங்களை மறுஅளவிடல்](/docs/tasks/configure-pod-container/resize-container-resources)

## பணிச்சுமைகளை தானியங்கியாக அளவிடல்

Kubernetes, பணிச்சுமைகளை _தானியங்கியாக அளவிடுவதையும்_ ஆதரிக்கிறது — இதுவே இந்தப் பக்கத்தின் முக்கிய கருப்பொருள்.

Kubernetes-இல் _தானியங்கி அளவிடல்_ என்பது, Pod-களின் தொகுப்பை நிர்வகிக்கும் ஒரு பொருளை (எடுத்துக்காட்டாக, {{< glossary_tooltip text="Deployment" term_id="deployment" >}}) தானாகவே புதுப்பிக்கும் திறனைக் குறிக்கிறது.

### கிடைமட்ட அளவிடல் (HPA)

Kubernetes-இல், [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (HPA) பயன்படுத்தி ஒரு பணிச்சுமையை தானியங்கியாக கிடைமட்டமாக அளவிடலாம்.

HPA ஒரு Kubernetes API வளமாகவும் {{< glossary_tooltip text="controller" term_id="controller" >}} ஆகவும் செயல்படுகிறது. இது CPU அல்லது நினைவக பயன்பாடு போன்ற கண்காணிக்கப்பட்ட வள உபயோகத்திற்கு ஏற்ப, பணிச்சுமையில் உள்ள {{< glossary_tooltip text="பிரதிகளின்" term_id="replica" >}} எண்ணிக்கையை இடைவிடாமல் சரிசெய்கிறது.

Deployment-க்கான HorizontalPodAutoscaler உள்ளமைவு குறித்த [விரிவான வழிகாட்டி](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough) கிடைக்கிறது.

### செங்குத்து அளவிடல் (VPA)

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

[VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) (VPA) மூலம் ஒரு பணிச்சுமையை தானியங்கியாக செங்குத்தாக அளவிடலாம்.
HPA-விலிருந்து மாறாக, VPA Kubernetes-உடன் இயல்பாக வராது — இது ஒரு add-on ஆகும், நீங்கள் அல்லது கொத்து நிர்வாகி அதை நிறுவ வேண்டும்.

நிறுவிய பிறகு, நிர்வகிக்கப்படும் பிரதிகளின் வளங்களை _எவ்வாறு_ மற்றும் _எப்போது_ அளவிடுவது என்பதை வரையறுக்கும் {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}} (CRDs) உருவாக்கலாம்.

{{< note >}}
VPA சரியாக செயல்படுவதற்கு உங்கள் கொத்தில் [Metrics Server](https://github.com/kubernetes-sigs/metrics-server) நிறுவப்பட்டிருக்க வேண்டும்.
{{< /note >}}

#### இடத்திலேயே Pod செங்குத்து அளவிடல்

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

Kubernetes {{< skew currentVersion >}} நிலவரப்படி, VPA Pod-களை இடத்திலேயே மறுஅளவிடுவதை ஆதரிக்கவில்லை — இந்த ஒருங்கிணைப்பு தற்போது வேலையில் உள்ளது.
Pod-களை கைமுறையாக இடத்திலேயே மறுஅளவிட, [இடத்திலேயே கொள்கலன் வளங்களை மறுஅளவிடல்](/docs/tasks/configure-pod-container/resize-container-resources/) காண்க.

### கொத்து அளவின் அடிப்படையில் தானியங்கி அளவிடல்

கொத்தின் அளவின் அடிப்படையில் அளவிடப்பட வேண்டிய பணிச்சுமைகளுக்கு (எடுத்துக்காட்டாக `cluster-dns` அல்லது பிற கணினி கூறுகள்),
[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler) பயன்படுத்தலாம்.
VPA போலவே, இதுவும் Kubernetes மையத்தின் ஒரு பகுதியல்ல — GitHub-இல் தனியான திட்டமாக வழங்கப்படுகிறது.

Cluster Proportional Autoscaler, திட்டமிடக்கூடிய {{< glossary_tooltip text="nodes" term_id="node" >}} மற்றும் cores எண்ணிக்கையைக் கண்காணித்து, இலக்கு பணிச்சுமையின் பிரதி எண்ணிக்கையை அதற்கேற்ப அளவிடுகிறது.

பிரதி எண்ணிக்கை மாறாமல் இருக்க வேண்டும் என்றால், கொத்தின் அளவின் அடிப்படையில் பணிச்சுமைகளை செங்குத்தாக அளவிட
[_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler) பயன்படுத்தலாம்.
இந்தத் திட்டம் **தற்போது beta நிலையில்** உள்ளது மற்றும் GitHub-இல் காணலாம்.

Cluster Proportional Autoscaler பணிச்சுமையின் பிரதி எண்ணிக்கையை அளவிடும் போது,
Cluster Proportional Vertical Autoscaler, கொத்தில் உள்ள nodes மற்றும்/அல்லது cores எண்ணிக்கையின் அடிப்படையில் பணிச்சுமையின் (எடுத்துக்காட்டாக Deployment அல்லது DaemonSet) வள கோரிக்கைகளை சரிசெய்கிறது.

### நிகழ்வு சார்ந்த தானியங்கி அளவிடல் (KEDA)

[_Kubernetes Event Driven Autoscaler_ (**KEDA**)](https://keda.sh/) போன்றவற்றைப் பயன்படுத்தி நிகழ்வுகளின் அடிப்படையில் பணிச்சுமைகளை அளவிடவும் முடியும்.

KEDA ஒரு CNCF-graduated திட்டம் ஆகும். இது செயலாக்கப்பட வேண்டிய நிகழ்வுகளின் எண்ணிக்கையின் அடிப்படையில் — எடுத்துக்காட்டாக, ஒரு வரிசையில் உள்ள செய்திகளின் எண்ணிக்கை — பணிச்சுமைகளை அளவிட உதவுகிறது. வெவ்வேறு நிகழ்வு மூலங்களுக்கான பல adapter-கள் கிடைக்கின்றன.

### அட்டவணை அடிப்படையில் தானியங்கி அளவிடல்

பணிச்சுமைகளை அளவிட மற்றொரு உத்தி — குறிப்பிட்ட நேரங்களில் அளவிடல் செயல்பாடுகளை **திட்டமிடுவது்** — எடுத்துக்காட்டாக, குறைவான பரிவர்த்தனை நேரங்களில் வள உபயோகத்தை குறைக்க.

நிகழ்வு சார்ந்த தானியங்கி அளவிடலைப் போலவே, இதை KEDA மற்றும் அதன் [`Cron` scaler](https://keda.sh/docs/latest/scalers/cron/) மூலம் அடையலாம்.
`Cron` scaler, பணிச்சுமைகளை அளவிட அட்டவணைகளையும் (time zones உட்பட) வரையறுக்க அனுமதிக்கிறது.

## கொத்து உள்கட்டமைப்பை அளவிடல்

பணிச்சுமைகளை அளவிடுவது மட்டும் போதாவிட்டால், கொத்து உள்கட்டமைப்பையே அளவிடலாம்.

கொத்து உள்கட்டமைப்பை அளவிடுவது பொதுவாக {{< glossary_tooltip text="nodes" term_id="node" >}} சேர்த்தல் அல்லது நீக்குதலைக் குறிக்கும்.
மேலும் தகவலுக்கு [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/) காண்க.

## {{% heading "whatsnext" %}}

- கிடைமட்ட அளவிடல் பற்றி மேலும் அறிய
  - [StatefulSet-ஐ அளவிடல்](/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscaler வழிகாட்டி](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [இடத்திலேயே கொள்கலன் வளங்களை மறுஅளவிடல்](/docs/tasks/configure-pod-container/resize-container-resources/)
- [கொத்தில் DNS சேவையை தானியங்கியாக அளவிடல்](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/) பற்றி அறிக
