---
reviewers:
- erictune
- deads2k
- liggitt
title: RBAC அனுமதி முறையைப் பயன்படுத்துதல்
content_type: concept
aliases: [/rbac/]
weight: 33
---

<!-- overview -->
பங்கு அடிப்படையிலான அணுகல் கட்டுப்பாடு (Role-based access control — RBAC) என்பது உங்கள் நிறுவனத்தில் உள்ள தனிப்பட்ட பயனர்களின் பங்குகளின் அடிப்படையில் கணினி அல்லது நெட்வொர்க் வளங்களுக்கான அணுகலை நிர்வகிக்கும் ஒரு முறையாகும்.

<!-- body -->
RBAC அனுமதி (Authorization) முறையானது `rbac.authorization.k8s.io`
{{< glossary_tooltip text="API குழு" term_id="api-group" >}} ஐப் பயன்படுத்தி அனுமதி முடிவுகளை இயக்குகிறது. இது Kubernetes API வழியாக கொள்கைகளை மாறும் வகையில் அமைக்க உங்களை அனுமதிக்கிறது.

RBAC ஐ இயக்க, `--authorization-config` கொடியுடன் {{< glossary_tooltip text="API சேவையகத்தை" term_id="kube-apiserver" >}} தொடங்குங்கள்:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: RBAC
  ...
```

அல்லது `--authorization-mode` கொடியில் `RBAC` சேர்த்து தொடங்கலாம்:

```shell
kube-apiserver --authorization-mode=...,RBAC --other-options --more-options
```

## API பொருட்கள் {#api-overview}

RBAC API நான்கு வகையான Kubernetes பொருட்களை அறிவிக்கிறது: _Role_, _ClusterRole_, _RoleBinding_ மற்றும் _ClusterRoleBinding_. இவற்றை `kubectl` போன்ற கருவிகளைப் பயன்படுத்தி விவரிக்கலாம் அல்லது திருத்தலாம்.

{{< caution >}}
இந்தப் பொருட்கள் வடிவமைப்பில் அணுகல் கட்டுப்பாடுகளை விதிக்கின்றன. கொத்தில் (Cluster) மாற்றங்கள் செய்யும்போது, சில மாற்றங்களைத் தடுக்கக்கூடிய [சலுகை அதிகரிப்பு தடுப்பு](#privilege-escalation-prevention-and-bootstrapping) பற்றி புரிந்துகொள்ளுங்கள்.
{{< /caution >}}

### Role மற்றும் ClusterRole

ஒரு RBAC _Role_ அல்லது _ClusterRole_ அனுமதிகளின் தொகுப்பை குறிக்கும் விதிகளைக் கொண்டிருக்கும். அனுமதிகள் கூட்டல் மட்டுமே (எந்த "மறுப்பு" விதிகளும் இல்லை).

ஒரு Role எப்போதும் குறிப்பிட்ட {{< glossary_tooltip text="பெயரிடல் வெளியில்" term_id="namespace" >}} (Namespace) அனுமதிகளை அமைக்கிறது. ClusterRole, மாறாக, பெயரிடல் வெளி அற்ற வளமாகும்.

ClusterRole பல வழிகளில் பயன்படுகிறது:

1. பெயரிடல் வெளி வளங்களில் அனுமதிகளை வரையறுத்து குறிப்பிட்ட பெயரிடல் வெளி(களுக்கு) அணுகல் வழங்க
2. பெயரிடல் வெளி வளங்களில் அனுமதிகளை வரையறுத்து அனைத்து பெயரிடல் வெளிகளிலும் அணுகல் வழங்க
3. கொத்து அளவிலான வளங்களில் அனுமதிகளை வரையறுக்க

பெயரிடல் வெளிக்குள் பங்கு வரையறுக்க Role பயன்படுத்துங்கள்; கொத்து அளவில் வரையறுக்க ClusterRole பயன்படுத்துங்கள்.

#### Role எடுத்துக்காட்டு

"default" பெயரிடல் வெளியில் {{< glossary_tooltip text="pods" term_id="pod" >}} படிக்க அனுமதி வழங்கும் Role எடுத்துக்காட்டு:

{{% code_sample file="access/simple-role.yaml" %}}

#### ClusterRole எடுத்துக்காட்டு

ClusterRole ஐப் பயன்படுத்தி எந்த பெயரிடல் வெளியிலும் {{< glossary_tooltip text="secrets" term_id="secret" >}} படிக்க அனுமதி வழங்கலாம் (எவ்வாறு [பிணைக்கப்படுகிறது](#rolebinding-and-clusterrolebinding) என்பதைப் பொறுத்து):

{{% code_sample file="access/simple-clusterrole.yaml" %}}

### RoleBinding மற்றும் ClusterRoleBinding

ஒரு role binding, ஒரு பங்கில் வரையறுக்கப்பட்ட அனுமதிகளை ஒரு பயனர் அல்லது பயனர் குழுவிற்கு வழங்குகிறது. இது *subjects* (பயனர்கள், குழுக்கள் அல்லது service accounts) பட்டியலையும், வழங்கப்படும் பங்கிற்கான குறிப்பையும் கொண்டிருக்கும்.

- **RoleBinding**: குறிப்பிட்ட பெயரிடல் வெளிக்குள் அனுமதி வழங்கும்
- **ClusterRoleBinding**: கொத்து முழுவதும் அனுமதி வழங்கும்

ஒரு RoleBinding அதே பெயரிடல் வெளியில் உள்ள எந்த Role ஐயும் குறிப்பிடலாம். மாற்றாக, ஒரு ClusterRole ஐ குறிப்பிட்டு அதை RoleBinding இன் பெயரிடல் வெளிக்கு பிணைக்கலாம்.

#### RoleBinding எடுத்துக்காட்டுகள் {#rolebinding-example}

"default" பெயரிடல் வெளியில் "jane" என்ற பயனருக்கு "pod-reader" Role வழங்கும் RoleBinding:

{{% code_sample file="access/simple-rolebinding-with-role.yaml" %}}

RoleBinding ஒரு ClusterRole ஐயும் குறிப்பிடலாம். கீழே உள்ள RoleBinding ஒரு ClusterRole ஐ குறிப்பிட்டாலும், "dave" "development" பெயரிடல் வெளியில் மட்டுமே Secrets படிக்க முடியும்:

{{% code_sample file="access/simple-rolebinding-with-clusterrole.yaml" %}}

#### ClusterRoleBinding எடுத்துக்காட்டு

கொத்து முழுவதும் "manager" குழுவில் உள்ள எந்த பயனரும் எந்த பெயரிடல் வெளியிலும் secrets படிக்க அனுமதிக்கும் ClusterRoleBinding:

{{% code_sample file="access/simple-clusterrolebinding.yaml" %}}

ஒரு binding ஐ உருவாக்கிய பிறகு, அது குறிப்பிடும் Role அல்லது ClusterRole ஐ மாற்ற முடியாது. `roleRef` ஐ மாற்ற முயன்றால் சரிபார்ப்பு பிழை கிடைக்கும். `roleRef` மாற்ற வேண்டுமென்றால், binding பொருளை நீக்கி புதியதை உருவாக்க வேண்டும்.

`kubectl auth reconcile` கட்டளை RBAC பொருட்களைக் கொண்ட manifest கோப்பிலிருந்து உருவாக்கவும் புதுப்பிக்கவும் பயன்படுகிறது. மேலும் தகவலுக்கு [கட்டளை பயன்பாடு](#kubectl-auth-reconcile) காணவும்.

## வளங்களை குறிப்பிடுதல்

Kubernetes API இல், பெரும்பாலான வளங்கள் அவற்றின் பொருள் பெயரின் சரம் பிரதிநிதித்துவத்தால் குறிப்பிடப்படுகின்றன. RBAC வளங்களை சரியான API endpoint URL இல் தோன்றும் அதே பெயரைப் பயன்படுத்தி குறிப்பிடுகிறது.

சில Kubernetes API கள் _subresource_ ஐ உள்ளடக்கும், எடுத்துக்காட்டாக Pod இன் logs. Pod logs கோரிக்கை இப்படி இருக்கும்:

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

RBAC role இல் subresource குறிப்பிட ஒரு slash (`/`) பயன்படுத்துங்கள். `pods` மற்றும் `pods/log` இரண்டையும் படிக்க அனுமதிக்க:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

`resourceNames` பட்டியல் மூலம் குறிப்பிட்ட வள நிகழ்வுகளுக்கு மட்டும் கோரிக்கைகளை கட்டுப்படுத்தலாம். `my-configmap` என்ற ConfigMap ஐ மட்டும் `get` அல்லது `update` செய்ய:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

{{< note >}}
`resourceNames` மூலம் **deletecollection** அல்லது உச்ச நிலை **create** கோரிக்கைகளை கட்டுப்படுத்த முடியாது. **list** அல்லது **watch** ஐ `resourceName` மூலம் கட்டுப்படுத்தினால், clients தங்கள் கோரிக்கையில் `metadata.name` field selector சேர்க்க வேண்டும்.
எடுத்துக்காட்டு: `kubectl get configmaps --field-selector=metadata.name=my-configmap`
{{< /note >}}

wildcard `*` சின்னம் அனைத்து resources, apiGroups, verbs ஐயும் குறிப்பிட பயன்படுகிறது.

{{< caution >}}
wildcard பயன்படுத்துவது உணர்திறன் வளங்களுக்கு அதிகப்படியான அனுமதி வழங்கக்கூடும். [குறைந்தபட்ச சலுகை கொள்கையை](/docs/concepts/security/rbac-good-practices/#least-privilege) பின்பற்றுங்கள்.
{{< /caution >}}

## திரட்டப்பட்ட ClusterRoles

பல ClusterRoles ஐ ஒரு ஒருங்கிணைந்த ClusterRole ஆக _திரட்டலாம்_ (aggregate). கட்டுப்பாட்டு தளத்தின் (Control Plane) ஒரு controller, `aggregationRule` அமைக்கப்பட்ட ClusterRole பொருட்களை கண்காணிக்கிறது.

{{< caution >}}
கட்டுப்பாட்டு தளம் திரட்டப்பட்ட ClusterRole இன் `rules` புலத்தில் நீங்கள் கைமுறையாக குறிப்பிட்ட மதிப்புகளை மேலெழுதும். விதிகளை மாற்ற வேண்டுமென்றால், `aggregationRule` மூலம் தேர்ந்தெடுக்கப்பட்ட ClusterRole பொருட்களில் செய்யுங்கள்.
{{< /caution >}}

திரட்டப்பட்ட ClusterRole எடுத்துக்காட்டு:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # கட்டுப்பாட்டு தளம் தானாக விதிகளை நிரப்பும்
```

"monitoring" ClusterRole க்கு விதிகள் சேர்க்க `rbac.example.com/aggregate-to-monitoring: true` label உடன் மற்றொரு ClusterRole உருவாக்கலாம்:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpointslices
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
rules:
- apiGroups: [""]
  resources: ["services", "pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["discovery.k8s.io"]
  resources: ["endpointslices"]
  verbs: ["get", "list", "watch"]
```

[இயல்புநிலை பயனர்-நோக்கு பங்குகள்](#default-roles-and-role-bindings) ClusterRole திரட்டலைப் பயன்படுத்துகின்றன. CronTab போன்ற தனிப்பயன் வளங்களை "admin" மற்றும் "edit" பங்குகளில் நிர்வகிக்க:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

## Subjects ஐ குறிப்பிடுதல்

ஒரு RoleBinding அல்லது ClusterRoleBinding ஒரு பங்கை subjects உடன் பிணைக்கிறது. Subjects ஆனது குழுக்கள், பயனர்கள் அல்லது {{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}} ஆக இருக்கலாம்.

Kubernetes பயனர் பெயர்களை சரங்களாக குறிப்பிடுகிறது: எளிய பெயர்கள் ("alice"), மின்னஞ்சல் வடிவ பெயர்கள் ("bob@example.com"), அல்லது எண் user ID கள் சரமாக. `system:` முன்னொட்டு Kubernetes கணினி பயன்பாட்டிற்காக ஒதுக்கப்பட்டுள்ளது.

{{< caution >}}
`system:` முன்னொட்டு Kubernetes கணினி பயன்பாட்டிற்காக ஒதுக்கப்பட்டுள்ளது. தற்செயலாக `system:` தொடங்கும் பயனர் அல்லது குழு பெயர்கள் இல்லாமல் பார்த்துக்கொள்ளுங்கள்.
{{< /caution >}}

[ServiceAccounts](/docs/tasks/configure-pod-container/configure-service-account/) `system:serviceaccount:` முன்னொட்டுடன் பெயர்களைக் கொண்டிருக்கும், மேலும் `system:serviceaccounts:` முன்னொட்டுடன் குழுக்களில் சேர்க்கப்படும்.

#### RoleBinding எடுத்துக்காட்டுகள் {#role-binding-examples}

`alice@example.com` என்ற பயனருக்கு:

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

`frontend-admins` என்ற குழுவிற்கு:

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

"kube-system" பெயரிடல் வெளியில் இயல்புநிலை service account க்கு:

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

"qa" பெயரிடல் வெளியில் உள்ள அனைத்து service accounts க்கும்:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

அனைத்து அங்கீகரிக்கப்பட்ட பயனர்களுக்கும்:

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

## இயல்புநிலை பங்குகளும் பங்கு பிணைப்புகளும்

API சேவையகங்கள் இயல்புநிலை ClusterRole மற்றும் ClusterRoleBinding பொருட்களை உருவாக்குகின்றன. இவற்றில் பலவற்றுக்கு `system:` முன்னொட்டு உள்ளது, இது கட்டுப்பாட்டு தளத்தால் நேரடியாக நிர்வகிக்கப்படும் வளத்தைக் குறிக்கிறது. அனைத்து இயல்புநிலை ClusterRoles மற்றும் ClusterRoleBindings க்கும் `kubernetes.io/bootstrapping=rbac-defaults` என்று label இடப்படும்.

{{< caution >}}
`system:` முன்னொட்டுடன் பெயர்களைக் கொண்ட ClusterRoles மற்றும் ClusterRoleBindings ஐ திருத்தும்போது கவனமாக இருங்கள். இந்த வளங்களில் மாற்றங்கள் செய்வது கொத்தை (Cluster) செயலற்றதாக மாற்றலாம்.
{{< /caution >}}

### தன்னியக்க சரிசெய்தல்

ஒவ்வொரு தொடக்கத்திலும், API சேவையகம் இயல்புநிலை cluster பங்குகளை தவறிய அனுமதிகளுடன் புதுப்பிக்கிறது. `rbac.authorization.kubernetes.io/autoupdate` annotation ஐ `false` என அமைத்து இந்த சரிசெய்தலை நிறுத்தலாம்.

### பயனர்-நோக்கு பங்குகள்

சில இயல்புநிலை ClusterRoles க்கு `system:` முன்னொட்டு இல்லை. இவை பயனர்-நோக்கு பங்குகள்:

| இயல்புநிலை ClusterRole | இயல்புநிலை ClusterRoleBinding | விவரிப்பு |
|------------------------|-------------------------------|-----------|
| **cluster-admin** | **system:masters** குழு | எந்த வளத்திலும் எந்த செயலும் செய்ய அனுமதிக்கும் super-user அணுகல். ClusterRoleBinding இல் பயன்படுத்தும்போது கொத்தில் உள்ள எல்லா வளங்களையும் கட்டுப்படுத்தலாம். |
| **admin** | இல்லை | RoleBinding மூலம் பெயரிடல் வெளிக்குள் வழங்கப்படும் admin அணுகல். பெயரிடல் வெளியில் roles மற்றும் role bindings உருவாக்கலாம். |
| **edit** | இல்லை | பெயரிடல் வெளியில் பெரும்பாலான பொருட்களை படிக்க/எழுத அனுமதிக்கும். roles அல்லது role bindings காண அல்லது திருத்த அனுமதிக்காது. |
| **view** | இல்லை | பெயரிடல் வெளியில் பெரும்பாலான பொருட்களை படிக்க மட்டும் அனுமதிக்கும். roles, role bindings அல்லது Secrets காண அனுமதிக்காது. |

### API கண்டுபிடிப்பு பங்குகள் {#discovery-roles}

| இயல்புநிலை ClusterRole | இயல்புநிலை ClusterRoleBinding | விவரிப்பு |
|------------------------|-------------------------------|-----------|
| **system:basic-user** | **system:authenticated** குழு | பயனர் தங்களைப் பற்றிய அடிப்படை தகவல்களை படிக்க மட்டும் அணுகல். |
| **system:discovery** | **system:authenticated** குழு | API கண்டுபிடிப்பு endpoints க்கு படிக்க மட்டும் அணுகல். |
| **system:public-info-viewer** | **system:authenticated** மற்றும் **system:unauthenticated** குழுக்கள் | கொத்தைப் பற்றிய உணர்திறன் அற்ற தகவல்களுக்கு படிக்க மட்டும் அணுகல். |

## சலுகை அதிகரிப்பு தடுப்பு மற்றும் bootstrapping {#privilege-escalation-prevention-and-bootstrapping}

RBAC API, பங்குகள் அல்லது பங்கு பிணைப்புகளை திருத்துவதன் மூலம் பயனர்கள் சலுகைகளை அதிகரிக்கவதைத் தடுக்கிறது. இது API நிலையில் செயல்படுத்தப்படுகிறது.

### பங்கு உருவாக்கல் அல்லது புதுப்பிப்பில் கட்டுப்பாடுகள்

பங்கை உருவாக்க/புதுப்பிக்க, கீழ்க்கண்டவற்றில் ஒன்றாவது உண்மையாக இருக்க வேண்டும்:

1. திருத்தப்படும் பொருளின் அதே நோக்கில் பங்கில் உள்ள அனைத்து அனுமதிகளும் உங்களிடம் ஏற்கனவே இருக்க வேண்டும்.
2. `rbac.authorization.k8s.io` API குழுவில் `roles` அல்லது `clusterroles` வளத்தில் `escalate` verb செய்ய உங்களுக்கு வெளிப்படையான அனுமதி வழங்கப்பட்டிருக்க வேண்டும்.

### பங்கு பிணைப்பு உருவாக்கல் அல்லது புதுப்பிப்பில் கட்டுப்பாடுகள்

குறிப்பிட்ட பங்கில் உள்ள அனைத்து அனுமதிகளும் உங்களிடம் இருந்தால் மட்டுமே, அல்லது குறிப்பிட்ட பங்கில் `bind` verb செய்ய அனுமதி இருந்தால் மட்டுமே role binding உருவாக்க/புதுப்பிக்க முடியும்.

எடுத்துக்காட்டாக, இந்த ClusterRole மற்றும் RoleBinding `user-1` க்கு `user-1-namespace` பெயரிடல் வெளியில் `admin`, `edit`, `view` பங்குகளை மற்றவர்களுக்கு வழங்க அனுமதிக்கும்:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

முதல் பங்குகள் மற்றும் பங்கு பிணைப்புகளை bootstrap செய்ய, "system:masters" குழு credential பயன்படுத்துங்கள், இது "cluster-admin" super-user பங்குடன் பிணைக்கப்பட்டுள்ளது.

## கட்டளை வரி பயன்பாடுகள்

### `kubectl create role`

ஒரு பெயரிடல் வெளிக்குள் அனுமதிகளை வரையறுக்கும் Role உருவாக்கும்:

```shell
# pods இல் get, watch, list செய்ய "pod-reader" Role உருவாக்க
kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods

# resourceNames குறிப்பிட்டு "pod-reader" Role உருவாக்க
kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod

# subresource அனுமதிகளுடன் Role உருவாக்க
kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
```

### `kubectl create clusterrole`

```shell
# pods இல் get, watch, list செய்ய "pod-reader" ClusterRole உருவாக்க
kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods

# nonResourceURL குறிப்பிட்டு ClusterRole உருவாக்க
kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*

# aggregationRule உடன் ClusterRole உருவாக்க
kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
```

### `kubectl create rolebinding`

```shell
# "acme" பெயரிடல் வெளியில் "bob" க்கு "admin" ClusterRole வழங்க
kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme

# "acme" பெயரிடல் வெளியில் "myapp" service account க்கு "view" ClusterRole வழங்க
kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
```

### `kubectl create clusterrolebinding`

```shell
# கொத்து முழுவதும் "root" பயனருக்கு "cluster-admin" ClusterRole வழங்க
kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root

# "acme" பெயரிடல் வெளியில் "myapp" service account க்கு கொத்து முழுவதும் "view" வழங்க
kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

manifest கோப்பிலிருந்து `rbac.authorization.k8s.io/v1` API பொருட்களை உருவாக்கவும் புதுப்பிக்கவும் பயன்படுகிறது:

```shell
# dry-run உடன் RBAC கோப்பை சோதிக்க
kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client

# RBAC கோப்பை பயன்படுத்த
kubectl auth reconcile -f my-rbac-rules.yaml

# கூடுதல் அனுமதிகள் மற்றும் subjects ஐ நீக்கி பயன்படுத்த
kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
```

## ServiceAccount அனுமதிகள் {#service-account-permissions}

இயல்புநிலை RBAC கொள்கைகள் கட்டுப்பாட்டு தள கூறுகளுக்கு, nodes க்கு, மற்றும் controllers க்கு வரையறுக்கப்பட்ட அனுமதிகள் வழங்குகின்றன. ஆனால் `kube-system` பெயரிடல் வெளிக்கு வெளியே service accounts க்கு *எந்த அனுமதியும் வழங்காது*.

மிகவும் பாதுகாப்பான முறை முதல் குறைவான பாதுகாப்பான முறை வரை:

1. **குறிப்பிட்ட application service account க்கு பங்கு வழங்குங்கள் (சிறந்த நடைமுறை)**

   ```shell
   kubectl create rolebinding my-sa-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:my-sa \
     --namespace=my-namespace
   ```

2. **பெயரிடல் வெளியில் "default" service account க்கு பங்கு வழங்குங்கள்**

   {{< note >}}
   "default" service account க்கு வழங்கப்பட்ட அனுமதிகள், `serviceAccountName` குறிப்பிடாத பெயரிடல் வெளியில் உள்ள எந்த pod க்கும் கிடைக்கும்.
   {{< /note >}}

   ```shell
   kubectl create rolebinding default-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:default \
     --namespace=my-namespace
   ```

3. **பெயரிடல் வெளியில் உள்ள அனைத்து service accounts க்கும் பங்கு வழங்குங்கள்**

   ```shell
   kubectl create rolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts:my-namespace \
     --namespace=my-namespace
   ```

4. **கொத்து முழுவதும் அனைத்து service accounts க்கும் குறைந்த பங்கு வழங்குங்கள் (நிரல் செய்யப்படவில்லை)**

   ```shell
   kubectl create clusterrolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts
   ```

5. **கொத்து முழுவதும் அனைத்து service accounts க்கும் super-user அணுகல் வழங்குங்கள் (மிகவும் நிரல் செய்யப்படவில்லை)**

   {{< warning >}}
   இது எந்த application க்கும் உங்கள் கொத்தில் முழு அணுகல் வழங்கும், மேலும் Secrets படிக்க அணுகல் உள்ள எந்த பயனருக்கும் முழு கொத்து அணுகல் வழங்கும்.
   {{< /warning >}}

   ```shell
   kubectl create clusterrolebinding serviceaccounts-cluster-admin \
     --clusterrole=cluster-admin \
     --group=system:serviceaccounts
   ```

## ABAC இலிருந்து மேம்படுத்துதல்

பழைய Kubernetes பதிப்புகளில் இயங்கிய கொத்துகள் பெரும்பாலும் அனுமதிக்கும் ABAC கொள்கைகளைப் பயன்படுத்தின. RBAC க்கு மாற இரண்டு அணுகுமுறைகள்:

### இணை authorizers

RBAC மற்றும் ABAC இரண்டையும் இயக்கி மரபு ABAC கொள்கை கோப்புடன் தொடங்கலாம்:

```shell
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

### அனுமதிக்கும் RBAC அனுமதிகள்

{{< warning >}}
கீழ்க்கண்ட கொள்கை அனைத்து service accounts க்கும் cluster administrator அணுகல் வழங்கும். இது பரிந்துரைக்கப்படாத கொள்கை.

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

## {{% heading "whatsnext" %}}

* [RBAC சிறந்த நடைமுறைகள்](/docs/concepts/security/rbac-good-practices/) பற்றி மேலும் அறிக
* [அங்கீகாரம் (Authentication)](/docs/reference/access-authn-authz/authentication/) பற்றி படிக்க
* [அனுமதி கண்ணோட்டம்](/docs/reference/access-authn-authz/authorization/) பார்க்க
* [Node அனுமதியாளர்](/docs/reference/access-authn-authz/node/) பற்றி அறிக
