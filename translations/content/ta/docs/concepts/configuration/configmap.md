---
reviewers:
- eparis
- pmorie
title: "ConfigMap"
description: >
  ConfigMap என்பது சேமிப்பக-அல்லாத API பொருளாகும், இது உள்ளமைவு (Configuration) தரவை சேமிக்கப் பயன்படுகிறது.
  key-value இணைகள். Pod-கள் ConfigMap-களை சுற்றுச்சூழல் மாறிகளாகவோ,
  கட்டளை வரி அளவுருக்களாகவோ அல்லது தொகுதி (Volume) கோப்புகளாகவோ பயன்படுத்தலாம்.
content_type: concept
weight: 20
---

<!-- overview -->

ConfigMap என்பது உள்ளமைவு (Configuration) தரவை key-value இணைகளில் சேமிக்கப் பயன்படும் API பொருளாகும்.
Pod-கள் ConfigMap-களை சுற்றுச்சூழல் மாறிகளாகவோ, கட்டளை வரி அளவுருக்களாகவோ
அல்லது ஒரு {{< glossary_tooltip text="தொகுதியில்" term_id="volume" >}} உள்ள உள்ளமைவு கோப்புகளாகவோ பயன்படுத்தலாம்.

ConfigMap உங்கள் {{< glossary_tooltip text="கொள்கலன்" term_id="container" >}} (Container) படங்களிலிருந்து
சூழல்-குறிப்பிட்ட உள்ளமைவை பிரிக்க உதவுகிறது, இதனால் உங்கள் பயன்பாடுகளை எளிதாகக் கையாளலாம்.

ConfigMap ஒரு {{< glossary_tooltip term_id="secret" >}}-ஐ போல் வடிவமைக்கப்படவில்லை. இது
குறியாக்கம் செய்யப்படாத தரவை வழங்குகிறது. உங்களுக்கு சேமிக்க வேண்டிய தரவு ரகசியமாக இருந்தால்,
ConfigMap-க்கு பதிலாக Secret-ஐ பயன்படுத்துங்கள்,
அல்லது உங்கள் தரவை பாதுகாக்க கூடுதல் (மூன்றாம் தரப்பு) கருவிகளைப் பயன்படுத்துங்கள்.

{{< caution >}}
ConfigMap ஆனது ஒரு Pod spec-ஐ குறிப்பிடும் ConfigMap-க்கு முன்பே உருவாக்கப்பட வேண்டும்
(ConfigMap பெயரை நேரடியாக குறிப்பிட), இல்லாவிட்டால் Pod தொடங்காது. இருப்பினும்,
ConfigMap குறிப்பு `optional` என்று குறிப்பிட்டிருந்தால், ConfigMap இல்லாமலே Pod தொடங்கும்;
இல்லாத ConfigMap-இன் பயன்பாட்டை கவனிக்கவும்.
{{< /caution >}}

<!-- body -->

## நோக்கம் (Motivation) {#motivation}

பயன்பாடு உள்ளமைவு தரவை சேமிக்க ConfigMap-ஐப் பயன்படுத்துங்கள். உங்களுக்கு
கொத்தில் (Cluster) நிறுவ வேண்டிய ஒரு பயன்பாடு இருந்தால், அது
`DATABASE_HOST` மற்றும் `DATABASE_PORT` போன்ற சுற்றுச்சூழல் மாறிகளைப் பயன்படுத்துகிறது என்று
வைத்துக்கொள்வோம். நீங்கள் இந்த உள்ளமைவை நிறுவனர் சூழலில் (development environment) மற்றும்
உற்பத்தி சூழலில் (production environment) தனித்தனியாக வழங்கலாம். நீங்கள் குறியீட்டை
குறியாக்கம் செய்வதிலிருந்தும் உள்ளமைவை பிரிக்க விரும்புகிறீர்கள் என்றால், ConfigMap
ஒரு நல்ல மூலோபாயம் ஆகும்.

ConfigMap ஆனது Secret-ஐ போல் வடிவமைக்கப்படவில்லை. 100 megabytes-க்கும் அதிகமான
தரவை சேமிக்க முயற்சிக்கவேண்டாம். அளவு வரம்பை மீறும் ConfigMap-ஐ நீங்கள் உருவாக்க முயற்சித்தால்,
API சேவையகம் (API Server) அதை நிராகரிக்கும். நீங்கள் 100 MiB-ஐ விட பெரிய உள்ளமைவு
தரவை சேமிக்க விரும்பினால், ஒரு தொகுதியை (Volume) ஏற்றுவதை அல்லது தனி தரவுத்தள அல்லது
கோப்பு சேவையை பயன்படுத்துவதை கவனியுங்கள்.

## ConfigMap பொருள் (ConfigMap object) {#configmap-object}

ConfigMap ஒரு API {{< glossary_tooltip text="பொருளாகும்" term_id="object" >}},
இது `data` மற்றும் `binaryData` புலங்களில் உள்ளமைவு தரவை சேமிக்கிறது. இந்த புலங்கள்
key-value இணைகளை ஏற்கின்றன. `data` புலமும் `binaryData` புலமும் ஐச்சியமானவை (optional).
`data` புலம் UTF-8 சரங்களைக் கொண்டிருக்கும் நோக்கில் வடிவமைக்கப்பட்டுள்ளது.
`binaryData` புலம் base64-எனக்கோடு செய்யப்பட்ட சரங்களாக குறிப்பிடப்படும் binary data-ஐக் கொண்டிருக்கும்
நோக்கில் வடிவமைக்கப்பட்டுள்ளது. ConfigMap-இன் பெயர் ஒரு செல்லுபடியாகும்
[DNS subdomain பெயராக](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
இருக்க வேண்டும்.

`data` புலத்தின் கீழுள்ள ஒவ்வொரு key-ம் alphanumeric எழுத்துகள், `-`, `_` அல்லது `.`
ஆகியவற்றால் ஆனதாக இருக்க வேண்டும். `data`-இல் சேமிக்கப்பட்ட key-கள் `binaryData` புலத்தில்
இருக்கக்கூடாது.

Kubernetes v1.19 முதல், ConfigMap வரையறையில் ஒரு `immutable` புலத்தை சேர்க்கலாம்
[மாற்ற இயலாத ConfigMap](#configmap-immutable)-ஐ உருவாக்க.

## ConfigMap-கள் மற்றும் Pod-கள் (ConfigMaps and Pods) {#configmaps-and-pods}

ConfigMap-ஐ குறிப்பிடும் Pod spec எழுதலாம், அதில் இருக்கும் தரவின் அடிப்படையில்
அந்த Pod-இல் உள்ள கொள்கலன்களை (Containers) உள்ளமைக்கலாம். Pod மற்றும் ConfigMap
ஒரே பெயரிடல் வெளியில் (Namespace) இருக்க வேண்டும்.

ஒரு ConfigMap-இன் உதாரண spec இங்கே உள்ளது:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # property-like keys; each key maps to a simple value
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # file-like keys
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```

ConfigMap-இல் உள்ள தரவை பயன்படுத்துவதற்கு Pod-கள் பயன்படுத்தக்கூடிய நான்கு வழிகள் உள்ளன:

1. கொள்கலன் (Container)-க்கான கட்டளையிலும் அளவுருக்களிலும்
2. கொள்கலன் (Container)-க்கான சுற்றுச்சூழல் மாறிகளாக
3. ஒரு read-only தொகுதியில் (Volume) கோப்பாக, பயன்பாடு படிக்கலாம்
4. Kubernetes API-யைப் பயன்படுத்தி Pod-க்குள் இருந்து படிக்கும் குறியீட்டை எழுதுவதன் மூலம்

இந்த வழிகள் நுகரப்படும் உள்ளமைவை மாதிரியாக்குவதில் வெவ்வேறு திறன்களை கொண்டுள்ளன.
முதல் மூன்று வழிகளுக்கும், {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
ConfigMap-இலிருந்து தரவை பயன்படுத்துகிறது, Pod-இன் கொள்கலன்களை (Containers) தொடங்கும் போது.

நான்காவது வழி ConfigMap மற்றும் அதன் உள்ளடக்கங்களை நேரடியாக படிக்க Kubernetes API-ஐ பயன்படுத்துமாறு
குறியீட்டை எழுத வேண்டும். Kubernetes API-ஐ அழைப்பதன் மூலம், ConfigMap மாற்றங்களை
நிகழும்போது அறிந்துகொள்ள **watch** செய்யலாம், மேலும் மாற்றம் ஏற்படும்போது
பதிலளிக்கலாம். இந்த வழி ConfigMap-ஐ நேரடியாக அணுகுவதால், வேறு பெயரிடல் வெளியிலோ (Namespace)
அல்லது கொத்தின் (Cluster) வெளியிலோ இருக்கும் ConfigMap-ஐயும் பயன்படுத்தலாம்.

`game-demo` ConfigMap-ஐ பயன்படுத்தும் ஒரு Pod உதாரணம் இங்கே உள்ளது:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: alpine
      command: ["sleep", "3600"]
      env:
        # Define the environment variable
        - name: PLAYER_INITIAL_LIVES # Notice that the case is different here
                                     # from the key name in the ConfigMap.
          valueFrom:
            configMapKeyRef:
              name: game-demo           # The ConfigMap this value comes from.
              key: player_initial_lives # The key to fetch.
        - name: UI_PROPERTIES_FILE_NAME
          valueFrom:
            configMapKeyRef:
              name: game-demo
              key: ui_properties_file_name
      volumeMounts:
        - name: config
          mountPath: "/config"
          readOnly: true
  volumes:
    # You set volumes at the Pod level, then mount them into containers inside that Pod
    - name: config
      configMap:
        # Provide the name of the ConfigMap you want to mount.
        name: game-demo
        # An array of keys from the ConfigMap to create as files
        items:
          - key: "game.properties"
            path: "game.properties"
          - key: "user-interface.properties"
            path: "user-interface.properties"
```

ஒரு ConfigMap-ஐ அனைத்து ConfigMap key-கள் அடங்கிய கோப்புகளாக ஒரு தொகுதியில் (Volume)
ஏற்றும்போது, `items` புலத்தை இல்லாமல் விடலாம், அனைத்து key-களும் அவற்றின் பெயர்களுடன்
கோப்புகளாக ஆகும்.

ஒரு ConfigMap-ஐ ஒரு தொகுதியில் (Volume) ஏற்றுவதற்கான மேலும் உதாரணங்கள்
[ஒரு Pod-இலிருந்து தொகுதியாக ConfigMap-ஐ பயன்படுத்துதல்](#using-configmaps-as-files-from-a-pod)
பகுதியில் காண்க.

## ConfigMap-களை பயன்படுத்துதல் (Using ConfigMaps) {#using-configmaps}

ConfigMap-கள் தரவு தொகுதிகளாக (data volumes) ஏற்றப்படலாம். ConfigMap-கள் Pod-இல்
நேரடியாக வெளிப்படுத்தப்படாமல் கொத்தின் (Cluster) மற்ற பகுதிகளாலும் பயன்படுத்தப்படலாம்.
எடுத்துக்காட்டாக, ConfigMap-கள் கொத்தின் (Cluster) மற்ற பகுதிகள்
உள்ளமைவிற்காக பயன்படுத்த வேண்டிய தரவை வைத்திருக்கலாம்.

ConfigMap-ஐ பயன்படுத்துவதற்கான மிகவும் பொதுவான வழி, ஒரே பெயரிடல் வெளியில் (Namespace)
உள்ள Pod-களில் இயங்கும் கொள்கலன்களுக்கான (Containers) உள்ளமைவை சரிசெய்வதாகும்.
நீங்கள் ConfigMap-ஐ தனித்தனியாக பயன்படுத்தலாம்.

எடுத்துக்காட்டாக, நீங்கள் ஒரு {{< glossary_tooltip text="add-on" term_id="addons" >}} அல்லது
{{< glossary_tooltip text="operator" term_id="operator-pattern" >}} ஒன்றை சந்திக்கலாம்
அது ConfigMap-இலிருந்து ஒரு Pod-இன் நடத்தையை சரிசெய்கிறது.

### ஒரு Pod-இலிருந்து கோப்புகளாக ConfigMap-ஐ பயன்படுத்துதல் {#using-configmaps-as-files-from-a-pod}

ஒரு Pod-இல் ஒரு தொகுதியில் (Volume) ConfigMap-ஐ பயன்படுத்த:

1. ஒரு ConfigMap உருவாக்கவும் அல்லது ஏற்கனவே இருக்கும் ஒன்றைப் பயன்படுத்துங்கள். பல Pod-கள்
   ஒரே ConfigMap-ஐ குறிப்பிடலாம்.
1. Pod-இன் வரையறையை திருத்தி, `.spec.volumes[]` கீழ் ஒரு தொகுதியை (Volume) சேர்க்கவும்.
   தொகுதிக்கு (Volume) எந்த பெயர் வேண்டுமானாலும் கொடுங்கள், மேலும்
   `.spec.volumes[].configMap.name` புலத்தை உங்கள் ConfigMap பொருளைக் குறிக்க அமைக்கவும்.
1. ஒவ்வொரு ConfigMap தேவைப்படும் கொள்கலனிலும் (Container) `.spec.containers[].volumeMounts[]`-ஐ சேர்க்கவும்.
   `.spec.containers[].volumeMounts[].readOnly = true` குறிப்பிட்டு
   `.spec.containers[].volumeMounts[].mountPath` -ஐ ConfigMap-கள் தோன்ற வேண்டிய
   ஒரு பயன்படுத்தப்படாத கோப்பகப் பெயருக்கு அமைக்கவும்.
1. உங்கள் படம் அல்லது கட்டளை வரியை அந்த கோப்பகத்தில் கோப்புகளைக் கண்டறியும் வகையில் மாற்றவும்.
   ConfigMap `data` map-இல் ஒவ்வொரு key-யும் `mountPath` கீழ் ஒரு கோப்பு பெயராக மாறும்.

ஒரு ConfigMap-ஐ தொகுதியில் (Volume) ஏற்றும் Pod-இன் ஒரு உதாரணம் இங்கே உள்ளது:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    configMap:
      name: myconfigmap
```

நீங்கள் பயன்படுத்த விரும்பும் ஒவ்வொரு ConfigMap-ஐயும் `.spec.volumes`-இல் குறிப்பிட வேண்டும்.

Pod-இல் பல கொள்கலன்கள் (Containers) இருந்தால், ஒவ்வொரு கொள்கலனுக்கும் அதன் சொந்த
`volumeMounts` தொகுதி தேவைப்படும், ஆனால் `.spec.volumes` ஒரே ஒரு ConfigMap-க்கு
மட்டுமே தேவைப்படும்.

#### ஏற்றப்பட்ட ConfigMap-கள் தானாக புதுப்பிக்கப்படும் (Mounted ConfigMaps are updated automatically) {#mounted-configmaps-are-updated-automatically}

தொகுதியில் (Volume) பயன்படுத்தப்படும் ஒரு ConfigMap புதுப்பிக்கப்படும் போது, projected key-கள்
இறுதியில் புதுப்பிக்கப்படும். kubelet ஒவ்வொரு ஒத்திசைவு சுழற்சியிலும்
ஏற்றப்பட்ட ConfigMap-கள் புதுமையாக இருக்கின்றனவா என்று சரிபார்க்கிறது.
இருப்பினும், kubelet குறிப்பிட்ட ConfigMap-இன் தற்போதைய மதிப்பை இட-நினைவகத்தில்
(local cache) சேமிக்கிறது. cache-இன் வகை
[KubeletConfiguration struct-இல்](https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/)
`ConfigMapAndSecretChangeDetectionStrategy` புலத்தைப் பயன்படுத்தி உள்ளமைக்கப்படுகிறது.

ஒரு ConfigMap-ஐ வாட்ச் (இயல்புநிலை), ttl-அடிப்படையிலான, அல்லது API சேவையகத்திற்கு (API server)
நேரடி கோரிக்கைகளால் redirection செய்யலாம். இதன் விளைவாக, ஒரு ConfigMap புதுப்பிக்கப்படும்
தருணத்திலிருந்து, புதிய key-கள் Pod-களுக்கு projected ஆகும் வரை மொத்த தாமதம்
kubelet ஒத்திசைவு காலம் + cache propagation தாமதம் ஆகும்.

{{< note >}}
ஒரு ConfigMap-ஐ [`subPath`](/docs/concepts/storage/volumes#using-subpath)
தொகுதி ஏற்றமாக (volume mount) பயன்படுத்தும் கொள்கலன்கள் (Containers) தன்னியக்க
ConfigMap புதுப்பிப்புகளை பெறாது.
{{< /note >}}

### சுற்றுச்சூழல் மாறிகளாக ConfigMap-களை பயன்படுத்துதல் (Using ConfigMaps as environment variables) {#using-configmaps-as-environment-variables}

ஒரு Pod-இல் சுற்றுச்சூழல் மாறியில் (environment variable) ConfigMap-ஐ பயன்படுத்த:

1. ஒவ்வொரு கொள்கலன் (Container) வரையறையிலும், பயன்படுத்த விரும்பும் ஒவ்வொரு ConfigMap key-க்கும்
   ஒரு சுற்றுச்சூழல் மாறியை `env[].valueFrom.configMapKeyRef` புலத்தைப் பயன்படுத்தி சேர்க்கவும்.
1. பயன்பாட்டை பயன்படுத்துவதற்கு படம் மற்றும்/அல்லது கட்டளை வரியை அந்த சுற்றுச்சூழல்
   மாறிகளைக் கண்டறியும் வகையில் மாற்றவும்.

ஒரு ConfigMap-இலிருந்து சுற்றுச்சூழல் மாறிகளை வரையறுக்கும் ஒரு Pod-இன் உதாரணம்:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-configmap
spec:
  containers:
  - name: envars-test-container
    image: nginx
    env:
    - name: CONFIGMAP_USERNAME
      valueFrom:
        configMapKeyRef:
          name: myconfigmap
          key: username
```

`configmap.yaml` கோப்பில் உள்ளமைவை வரையறுக்க:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myconfigmap
data:
  username: demo-user
```

ஒரு ConfigMap-இலிருந்து அனைத்து key-value இணைகளையும் சுற்றுச்சூழல் மாறிகளாக இறக்குமதி செய்ய
`envFrom` பயன்படுத்தலாம். ConfigMap-இல் உள்ள key-கள் Pod-இல் சுற்றுச்சூழல் மாறி
பெயர்களாக மாறும்:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-configmap
spec:
  containers:
  - name: envars-test-container
    image: nginx
    envFrom:
    - configMapRef:
        name: myconfigmap
```

{{< note >}}
`envFrom` பயன்படுத்தும் போது, சுற்றுச்சூழல் மாறி பெயர்களாக செல்லுபடியற்ற
(invalid) key-கள் தவிர்க்கப்படும். Pod இன்னும் தொடங்கும், ஆனால் செல்லுபடியற்ற பெயர்கள்
`InvalidVariableNames` நிகழ்வில் (event) பதிவு செய்யப்படும்.
செய்தி தவிர்க்கப்பட்ட key-களின் பட்டியலை அடங்கும்.
{{< /note >}}

## மாற்ற இயலாத ConfigMap-கள் (Immutable ConfigMaps) {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Kubernetes-இன் `immutable` Secrets மற்றும் ConfigMaps அம்சம் தனிப்பட்ட Secrets மற்றும் ConfigMap-களை
மாற்ற இயலாததாக (immutable) அமைக்கும் விருப்பத்தை வழங்குகிறது. ConfigMap-களை பரவலாகப் பயன்படுத்தும்
கொத்துகளுக்கு (Clusters) (குறைந்தபட்சம் பல பத்தாயிரம் தனித்தனி ConfigMap-க்கு Pod-கள் ஏற்றல்கள்),
இந்த தரவு மாற்றங்களை தடுப்பது பின்வரும் நன்மைகளைத் தருகிறது:

- தற்செயலான (அல்லது தேவையற்ற) புதுப்பிப்புகளிலிருந்து பயன்பாட்டை பாதுகாக்கிறது
- kube-apiserver-க்கான சுமையை கணிசமாகக் குறைக்கிறது, ஏற்றப்பட்ட ConfigMap-கள்
  மாற்றங்களுக்காக தொடர்ச்சியாக கண்காணிக்கப்படுவதை நிறுத்துவதன் மூலம் கொத்தின் (Cluster)
  செயல்திறனை மேம்படுத்துகிறது

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
immutable: true
```

ஒரு ConfigMap-ஐ மாற்ற இயலாதது (immutable) என்று அமைத்தவுடன், இந்த மாற்றத்தை
செயல்தவிர்க்கவோ அல்லது `data` அல்லது `binaryData` புலங்களின் உள்ளடக்கங்களை மாற்றவோ
_சாத்தியமில்லை_. நீங்கள் ConfigMap-ஐ மட்டுமே நீக்கலாம் மற்றும் மீண்டும் உருவாக்கலாம்.
ஏனெனில் தற்போதைய Pod-கள் நீக்கப்பட்ட ConfigMap-க்கான ஏற்ற புள்ளியை (mount point)
பராமரிக்கின்றன, அந்த Pod-களை மீண்டும் உருவாக்குவது பரிந்துரைக்கப்படுகிறது.

## {{% heading "whatsnext" %}}

* [Secrets](/docs/concepts/configuration/secret/) பற்றி மேலும் படிக்கவும்.
* [ConfigMap பயன்படுத்தல் குறித்த சுவாரஸ்யமான கட்டுரை](https://kubernetes.io/blog/2016/04/configuration-management-with-containers/) படிக்கவும்.
* [API குறிப்பிலிருந்து ConfigMap](/docs/reference/kubernetes-api/config-and-storage-resources/config-map-v1/) படிக்கவும்.
