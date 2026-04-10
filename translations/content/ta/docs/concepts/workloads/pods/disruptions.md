---
reviewers:
- erictune
- foxish
- davidopp
title: சீர்குலைவுகள் (Disruptions)
content_type: concept
weight: 70
---

<!-- overview -->
இந்த வழிகாட்டி, அதிக கிடைக்கும் தன்மை (high availability) கொண்ட பயன்பாடுகளை உருவாக்க விரும்பும் பயன்பாட்டு உரிமையாளர்களுக்காக எழுதப்பட்டது — Pod-களுக்கு என்னென்ன வகையான சீர்குலைவுகள் நிகழலாம் என்பதை அவர்கள் புரிந்துகொள்ள வேண்டும்.

கொத்து (Cluster) நிர்வாகிகளுக்கும் இது பயனுள்ளது — கொத்தை மேம்படுத்துதல், தானியங்கி அளவிடல் போன்ற தானியங்கு செயல்களை மேற்கொள்பவர்களுக்கு.

<!-- body -->

## தன்னிச்சையான மற்றும் தவிர்க்க முடியாத சீர்குலைவுகள்

யாரேனும் (ஒரு நபர் அல்லது ஒரு controller) அவற்றை நீக்காத வரையிலும், அல்லது தவிர்க்க முடியாத வன்பொருள் / மென்பொருள் பிழை நேரும் வரையிலும், Pod-கள் மறைவதில்லை.

இந்தத் தவிர்க்க முடியாத நிகழ்வுகளை நாம் *தவிர்க்க முடியாத சீர்குலைவுகள் (involuntary disruptions)* என்கிறோம். எடுத்துக்காட்டுகள்:

- Node-ஐ இயக்கும் இயற்பியல் இயந்திரத்தின் வன்பொருள் தோல்வி
- கொத்து நிர்வாகி தவறுதலாக VM-ஐ நீக்குதல்
- cloud வழங்குநர் அல்லது hypervisor தோல்வியால் VM மறைதல்
- kernel panic
- கொத்து வலைப்பின்னல் பிரிவினையால் Node கொத்தை விட்டு நீங்குதல்
- Node [வளங்கள் தீர்ந்த நிலையில்](/docs/concepts/scheduling-eviction/node-pressure-eviction/) Pod வெளியேற்றம்

வளங்கள் தீர்ந்த நிலை தவிர, இந்த நிகழ்வுகள் எல்லாம் பெரும்பாலான பயனர்களுக்கு நன்கு தெரிந்தவை; இவை Kubernetes-க்கு மட்டுமே உரியவை அல்ல.

மற்றவற்றை *தன்னிச்சையான சீர்குலைவுகள் (voluntary disruptions)* என்கிறோம். இவை பயன்பாட்டு உரிமையாளரோ அல்லது கொத்து நிர்வாகியோ தொடங்குபவை. வழக்கமான பயன்பாட்டு உரிமையாளர் செயல்கள்:

- Pod-ஐ நிர்வகிக்கும் deployment அல்லது controller-ஐ நீக்குதல்
- deployment-இன் pod template-ஐ புதுப்பித்து மறுதொடக்கம் ஏற்படுத்துதல்
- Pod-ஐ நேரடியாக நீக்குதல் (எ.கா. தவறுதலாக)

கொத்து நிர்வாகி செயல்கள்:

- பழுது அல்லது மேம்படுத்தலுக்காக [Node-ஐ drain செய்தல்](/docs/tasks/administer-cluster/safely-drain-node/)
- கொத்தை சுருக்க Node-ஐ drain செய்தல் ([Node Autoscaling](/docs/concepts/cluster-administration/node-autoscaling/))
- வேறு பணிச்சுமைக்கு இடம் ஒதுக்க Pod-ஐ Node-இலிருந்து அகற்றுதல்

இவற்றை நிர்வாகி நேரடியாக, அல்லது தானியங்கி கருவிகள் மூலம், அல்லது hosting வழங்குநர் மூலம் செய்யலாம்.

உங்கள் கொத்தில் தன்னிச்சையான சீர்குலைவுகள் இயக்கப்பட்டிருக்கின்றனவா என்பதை கொத்து நிர்வாகியிடம் கேளுங்கள். இல்லையெனில், Pod Disruption Budget-கள் உருவாக்குவதை தவிர்க்கலாம்.

{{< caution >}}
அனைத்து தன்னிச்சையான சீர்குலைவுகளும் Pod Disruption Budget-களால் கட்டுப்படுத்தப்படுவதில்லை. எடுத்துக்காட்டாக, deployment அல்லது Pod-களை நீக்குவது PDB-களை கடந்து செல்லும்.
{{< /caution >}}

## சீர்குலைவுகளை கையாளுதல்

தவிர்க்க முடியாத சீர்குலைவுகளை குறைக்க சில வழிகள்:

- உங்கள் Pod-க்கு தேவையான [வளங்களை கோருங்கள்](/docs/tasks/configure-pod-container/assign-memory-resource).
- அதிக கிடைக்கும் தன்மை தேவைப்பட்டால் பயன்பாட்டை பிரதிபலிக்கவும் ([stateless](/docs/tasks/run-application/run-stateless-application-deployment/) மற்றும் [stateful](/docs/tasks/run-application/run-replicated-stateful-application/) பயன்பாடுகளை இயக்குதல் பற்றி அறியுங்கள்).
- மேலும் அதிக கிடைக்கும் தன்மைக்கு, [anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) மூலம் rack-கள் அல்லது [multi-zone cluster](/docs/setup/multiple-zones) மூலம் zones-கள் வழியே பயன்பாட்டை பரவலாக்குங்கள்.

தன்னிச்சையான சீர்குலைவுகளின் அதிர்வெண் மாறுபடும். அடிப்படை Kubernetes கொத்தில், தன்னிச்சையான தானியங்கு சீர்குலைவுகள் இல்லை. ஆனால் நிர்வாகி அல்லது hosting வழங்குநர் சில கூடுதல் சேவைகளை இயக்கலாம். [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/) போன்ற கட்டமைப்பு விருப்பங்களும் சீர்குலைவுகளை ஏற்படுத்தலாம்.

## Pod சீர்குலைவு வரவுசெலவுத்திட்டங்கள் (Pod Disruption Budgets)

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

அடிக்கடி தன்னிச்சையான சீர்குலைவுகள் இருந்தாலும் அதிக கிடைக்கும் தன்மையுடன் பயன்பாடுகளை இயக்க Kubernetes உதவுகிறது.

பயன்பாட்டு உரிமையாளராக, ஒவ்வொரு பயன்பாட்டிற்கும் ஒரு PodDisruptionBudget (PDB) உருவாக்கலாம். PDB என்பது தன்னிச்சையான சீர்குலைவுகளால் ஒரே நேரத்தில் கீழே போகும் Pod-களின் எண்ணிக்கையை கட்டுப்படுத்துகிறது. எடுத்துக்காட்டாக, quorum-அடிப்படையிலான பயன்பாடு quorum-க்கு தேவையான குறைந்தபட்ச replica-கள் எப்போதும் இயங்குவதை உறுதி செய்யும்.

கொத்து நிர்வாகிகளும் hosting வழங்குநர்களும் Pod-களை நேரடியாக நீக்குவதற்கு பதிலாக [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api) வழியாக PodDisruptionBudget-களை மதிக்கும் கருவிகளை பயன்படுத்த வேண்டும்.

எடுத்துக்காட்டாக, `kubectl drain` கட்டளை ஒரு Node-ஐ சேவையிலிருந்து விலக்க பயன்படுகிறது. `kubectl drain` இயங்கும்போது, அது Node-இல் உள்ள அனைத்து Pod-களையும் வெளியேற்ற முயற்சிக்கும். வெளியேற்றல் கோரிக்கை தற்காலிகமாக நிராகரிக்கப்பட்டால், கருவி இடைவிடாமல் மீண்டும் முயற்சிக்கும்.

ஒரு PDB, பயன்பாட்டிற்கு எத்தனை replicas கிடைக்கும் என்பதை குறிப்பிடுகிறது. எடுத்துக்காட்டாக, `.spec.replicas: 5` கொண்ட Deployment-க்கு PDB குறைந்தது 4 Pod-கள் இருக்க வேண்டும் என்று சொன்னால், Eviction API ஒரே நேரத்தில் ஒரு Pod மட்டுமே சீர்குலைவை அனுமதிக்கும்.

பயன்பாட்டை உருவாக்கும் Pod-களின் குழு label selector மூலம் குறிப்பிடப்படுகிறது — controller (deployment, stateful-set) பயன்படுத்துவதே போல.

[தவிர்க்க முடியாத சீர்குலைவுகளை](#voluntary-and-involuntary-disruptions) PDB-கள் தடுக்க முடியாது; ஆனால் அவை வரவுசெலவுத்திட்டத்தில் கணக்கிடப்படும்.

rolling upgrade-இல் நீக்கப்படும் அல்லது கிடைக்காத Pod-கள் சீர்குலைவு வரவுசெலவுத்திட்டத்தில் கணக்கிடப்படும், ஆனால் Deployment மற்றும் StatefulSet rolling upgrade செய்யும்போது PDB-களால் கட்டுப்படுத்தப்படுவதில்லை.

Node drain-இன்போது சரியாக இயங்காத பயன்பாட்டு Pod-களை வெளியேற்ற, PodDisruptionBudget-களில் `AlwaysAllow` [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy) அமைக்க பரிந்துரைக்கப்படுகிறது.

Pod வெளியேற்றப்படும்போது, அது `terminationGracePeriodSeconds` அமைப்பை மதித்து நேர்த்தியாக [நிறுத்தப்படுகிறது](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

## PodDisruptionBudget எடுத்துக்காட்டு {#pdb-example}

3 Node-கள் கொண்ட ஒரு கொத்தை கவனியுங்கள்: `node-1` முதல் `node-3` வரை. ஒரு பயன்பாட்டில் `pod-a`, `pod-b`, `pod-c` என 3 replicas உள்ளன. PDB இல்லாத `pod-x`-ம் உள்ளது. ஆரம்பத்தில்:

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

3 Pod-களும் ஒரே deployment-இல் சேர்ந்தவை; PDB குறைந்தது 2 Pod-கள் எப்போதும் கிடைக்க வேண்டும் என்று கோருகிறது.

கொத்து நிர்வாகி kernel புதுப்பிப்புக்காக `node-1`-ஐ drain செய்ய முயல்கிறார். `pod-a` மற்றும் `pod-x` உடனே வெளியேற்றப்படுகின்றன:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

Deployment `pod-d` என்ற பதிலீட்டை உருவாக்குகிறது. `node-1` cordoned ஆனதால் அது மற்றொரு Node-ல் இயங்குகிறது. `pod-x`-க்கு பதிலாக `pod-y` உருவாக்கப்படுகிறது:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* | pod-d *starting*    | pod-y              |

சிறிது நேரத்தில் Pod-கள் நிறுத்தப்பட்டு:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y              |

இந்த நிலையில் `node-2` அல்லது `node-3`-ஐ drain செய்ய முயன்றால், deployment-க்கு 2 Pod-கள் மட்டுமே கிடைக்கும் என்பதால் PDB தடுக்கும். `pod-d` கிடைக்கும்போது:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *available*   | pod-y              |

இப்போது `node-2`-ஐ drain செய்யும்போது `pod-b` வெளியேற்றப்படும், ஆனால் `pod-d`-ஐ வெளியேற்றினால் ஒரே ஒரு Pod மட்டும் மிஞ்சும் என்பதால் நிராகரிக்கப்படும். `pod-b`-க்கு பதிலாக `pod-e` உருவாக்கப்படுகிறது, ஆனால் கொத்தில் போதுமான வளங்கள் இல்லாவிட்டால்:

|    node-1 *drained*  |       node-2        |       node-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *terminating* | pod-c *available*  | pod-e *pending*    |
|                      | pod-d *available*   | pod-y              |                    |

இப்போது மேம்படுத்தலை தொடர நிர்வாகி ஒரு புதிய Node சேர்க்க வேண்டும்.

Kubernetes சீர்குலைவுகள் நிகழும் வேகத்தை கீழ்வருவற்றின் அடிப்படையில் மாற்றுகிறது:

- பயன்பாட்டிற்கு எத்தனை replicas தேவை
- ஒரு instance நேர்த்தியாக நிறுத்தப்பட எடுக்கும் நேரம்
- புதிய instance தொடங்க எடுக்கும் நேரம்
- controller வகை
- கொத்தின் வள திறன்

## Pod சீர்குலைவு நிபந்தனைகள் {#pod-disruption-conditions}

{{< feature-state feature_gate_name="PodDisruptionConditions" >}}

Pod நீக்கப்படவிருக்கிறது என்பதை தெரிவிக்க `DisruptionTarget` என்ற சிறப்பு [நிபந்தனை](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) சேர்க்கப்படுகிறது. நிபந்தனையின் `reason` புலம் கீழ்வரும் காரணங்களில் ஒன்றை குறிக்கும்:

`PreemptionByScheduler`
: அதிக முன்னுரிமை கொண்ட புதிய Pod-க்கு இடமளிக்க scheduler-ஆல் Pod முன்னெடுக்கப்படுகிறது. மேலும் அறிய: [Pod priority preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

`DeletionByTaintManager`
: Pod பொறுத்துக்கொள்ளாத `NoExecute` taint காரணமாக Taint Manager-ஆல் Pod நீக்கப்படுகிறது.

`EvictionByEvictionAPI`
: [Kubernetes API மூலம் வெளியேற்றலுக்காக](/docs/concepts/scheduling-eviction/api-eviction/) Pod குறிக்கப்பட்டுள்ளது.

`DeletionByPodGC`
: இனி இல்லாத Node-உடன் இணைந்த Pod, [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection) மூலம் நீக்கப்படவிருக்கிறது.

`TerminationByKubelet`
: [node pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/), [graceful node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown), அல்லது [system critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/) முன்னெடுப்பு காரணமாக kubelet-ஆல் Pod நிறுத்தப்பட்டது.

[Pod container limits](/docs/concepts/configuration/manage-resources-containers/) மீறல் போன்ற மற்ற சீர்குலைவு சூழல்களில் `DisruptionTarget` நிபந்தனை சேர்க்கப்படுவதில்லை — ஏனெனில் அந்த சீர்குலைவுகள் Pod-ஆல் ஏற்பட்டவை, மீண்டும் முயன்றாலும் நிகழலாம்.

{{< note >}}
Pod சீர்குலைவு இடையில் நிறுத்தப்படலாம். control plane அதே Pod-இன் சீர்குலைவை மீண்டும் முயற்சிக்கலாம், ஆனால் உறுதி இல்லை. எனவே `DisruptionTarget` நிபந்தனை சேர்க்கப்பட்டாலும், Pod உண்மையில் நீக்கப்படாமல் போகலாம். சிறிது நேரத்தில் அந்த நிபந்தனை நீக்கப்படும்.
{{< /note >}}

Pod-களை சுத்தம் செய்வதுடன், terminal அல்லாத கட்டத்தில் உள்ள Pod-களை Pod garbage collector (PodGC) தோல்வியடைந்தவை என குறிக்கும் ([Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)).

Job (அல்லது CronJob) பயன்படுத்துகையில், இந்த Pod சீர்குலைவு நிபந்தனைகளை Job-இன் [Pod failure policy](/docs/concepts/workloads/controllers/job#pod-failure-policy)-இல் பயன்படுத்தலாம்.

## கொத்து உரிமையாளர் மற்றும் பயன்பாட்டு உரிமையாளர் பாத்திரங்கள்

பெரும்பாலும் கொத்து நிர்வாகியையும் பயன்பாட்டு உரிமையாளரையும் தனித்தனி பாத்திரங்களாக கருதுவது பயனுள்ளது. இந்த பொறுப்பு பிரிவு பின்வரும் சூழல்களில் பொருத்தமானது:

- பல பயன்பாட்டு குழுக்கள் ஒரு Kubernetes கொத்தை பகிர்ந்து கொள்ளும்போது
- மூன்றாம் தரப்பு கருவிகள் அல்லது சேவைகள் கொத்து நிர்வாகத்தை தானியங்குபடுத்தும்போது

Pod Disruption Budget-கள் இந்த பாத்திர பிரிவை பாத்திரங்களுக்கிடையே இடைமுகம் (interface) வழங்குவதன் மூலம் ஆதரிக்கின்றன.

உங்கள் நிறுவனத்தில் இத்தகைய பொறுப்பு பிரிவு இல்லையெனில், Pod Disruption Budget-கள் தேவைப்படாமல் போகலாம்.

## கொத்தில் சீர்குலைவு தரும் செயல்களை எவ்வாறு மேற்கொள்வது

கொத்து நிர்வாகியாக இருந்தால், மேம்படுத்தல் போன்ற கொத்தில் உள்ள அனைத்து Node-களிலும் சீர்குலைவு தரும் செயல்களை செய்ய வேண்டியிருந்தால், இந்த விருப்பங்களை கவனியுங்கள்:

- மேம்படுத்தலின்போது கீழே போவதை ஏற்றுக்கொள்ளுங்கள்.
- மற்றொரு முழுமையான replica கொத்திற்கு failover செய்யுங்கள்.
  - கீழே போவது இல்லை, ஆனால் இரட்டிப்பு Node-களுக்கும் மாற்றத்தை ஒருங்கிணைக்கவும் செலவாகும்.
- சீர்குலைவு-பொறுமையான பயன்பாடுகளை எழுதி PDB-களை பயன்படுத்துங்கள்.
  - கீழே போவது இல்லை.
  - குறைந்தபட்ச வள இரட்டிப்பு.
  - கொத்து நிர்வாகத்தின் அதிக தானியங்குபடுத்தலை அனுமதிக்கிறது.
  - சீர்குலைவு-பொறுமையான பயன்பாடுகளை எழுதுவது சவாலானது, ஆனால் தன்னிச்சையான சீர்குலைவுகளை பொறுமிக்க செய்யும் பணி, autoscaling ஆதரவு மற்றும் தவிர்க்க முடியாத சீர்குலைவுகளை பொறுமிக்கும் பணியுடன் பெரும்பாலும் ஒன்றுடன் ஒன்று மேலோட்டமாக இருக்கும்.

## {{% heading "whatsnext" %}}

* [Pod Disruption Budget கட்டமைத்தல்](/docs/tasks/run-application/configure-pdb/) மூலம் உங்கள் பயன்பாட்டை பாதுகாக்கவும்.

* [Node-களை drain செய்தல்](/docs/tasks/administer-cluster/safely-drain-node/) பற்றி மேலும் அறியுங்கள்.

* [deployment-ஐ புதுப்பித்தல்](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment) பற்றி அறியுங்கள் — rollout-இன்போது கிடைக்கும் தன்மையை பராமரிக்கும் படிகள் உட்பட.
