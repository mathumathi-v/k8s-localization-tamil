---
reviewers:
  - mikedanese
title: Secrets
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: Secret மற்றும் உள்ளமைவு மேலாண்மை
  description: >
    உங்கள் படத்தை மீண்டும் உருவாக்காமலும், stack உள்ளமைவில் Secret-களை
    வெளிப்படுத்தாமலும் Secret-களையும் பயன்பாட்டு உள்ளமைவையும் பயன்படுத்துங்கள்.
weight: 30
---

<!-- overview -->

Secret என்பது கடவுச்சொல் (password), டோக்கன் (token) அல்லது திறவுகோல் (key) போன்ற சிறிய அளவிலான
உணர்திறன் வாய்ந்த தரவை உள்ளடக்கிய ஒரு Kubernetes பொருளாகும். இத்தகைய தகவல்கள் பொதுவாக
ஒரு {{< glossary_tooltip term_id="pod" >}} spec-இல் அல்லது
{{< glossary_tooltip text="கொள்கலன் படத்தில்" term_id="image" >}} (container image) வைக்கப்படலாம்.
Secret-ஐப் பயன்படுத்துவது என்பது, உங்கள் பயன்பாட்டுக் குறியீட்டில் இரகசியத் தரவை சேர்க்க
வேண்டிய அவசியமில்லை என்பதை உறுதிசெய்கிறது.

Secret-கள் அவற்றைப் பயன்படுத்தும் Pod-களிலிருந்து சுயாதீனமாக உருவாக்கப்படுவதால்,
Pod-களை உருவாக்குதல், பார்த்தல் மற்றும் திருத்துதல் ஆகிய பணிப்பாய்வுகளின் போது
Secret (மற்றும் அதன் தரவு) வெளிப்படும் அபாயம் குறைவாக உள்ளது. Kubernetes மற்றும்
உங்கள் கொத்தில் (Cluster) இயங்கும் பயன்பாடுகளும் Secret-களுடன் கூடுதல் முன்னெச்சரிக்கை
நடவடிக்கைகளை எடுக்கலாம், எடுத்துக்காட்டாக நிலையற்ற சேமிப்பகத்தில் (nonvolatile storage)
உணர்திறன் வாய்ந்த தரவை எழுதுவதை தவிர்க்கலாம்.

Secret-கள் {{< glossary_tooltip text="ConfigMap-களை" term_id="configmap" >}} போன்றவையே,
ஆனால் இவை குறிப்பாக இரகசியத் தரவை வைத்திருப்பதற்காக வடிவமைக்கப்பட்டவை.

{{< caution >}}
இயல்பாக, Kubernetes Secret-கள் API சேவையகத்தின் (API server) அடிப்படை தரவுக் கடையில் (etcd)
குறியாக்கமின்றி (unencrypted) சேமிக்கப்படுகின்றன. API அணுகல் உள்ள எவரும் ஒரு Secret-ஐ
மீட்டெடுக்கலாம் அல்லது மாற்றலாம்; etcd அணுகல் உள்ளவர்களும் அதையே செய்யலாம்.
மேலும், ஒரு பெயரிடல் வெளியில் (Namespace) Pod உருவாக்க அங்கீகரிக்கப்பட்ட எவரும்
அந்த பெயரிடல் வெளியில் உள்ள எந்த Secret-ஐயும் படிக்கலாம்; இதில் Deployment உருவாக்கும்
திறன் போன்ற மறைமுகமான அணுகலும் அடங்கும்.

Secret-களை பாதுகாப்பாக பயன்படுத்த, குறைந்தபட்சம் பின்வரும் படிகளை எடுக்கவும்:

1. Secret-களுக்கான [Encryption at Rest இயக்கவும்](/docs/tasks/administer-cluster/encrypt-data/).
1. குறைந்த சலுகை அணுகலுடன் [RBAC விதிகளை இயக்கவும் அல்லது உள்ளமைக்கவும்](/docs/reference/access-authn-authz/authorization/).
1. Secret அணுகலை குறிப்பிட்ட கொள்கலன்களுக்கு (Containers) மட்டுமே கட்டுப்படுத்தவும்.
1. [வெளிப்புற Secret கடை வழங்குநர்களைப் பயன்படுத்துவதை பரிசீலிக்கவும்](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).

உங்கள் Secret-களை நிர்வகிக்கவும் மேம்படுத்தவும் மேலும் வழிகாட்டுதல்களுக்கு,
[Kubernetes Secret-களுக்கான சிறந்த நடைமுறைகள்](/docs/concepts/security/secrets-good-practices) பார்க்கவும்.

{{< /caution >}}

மேலும் விவரங்களுக்கு [Secret-களுக்கான தகவல் பாதுகாப்பு](#information-security-for-secrets) பார்க்கவும்.

<!-- body -->

## Secret-களின் பயன்பாடுகள் (Uses for Secrets) {#uses-for-secrets}

பின்வரும் நோக்கங்களுக்காக Secret-களைப் பயன்படுத்தலாம்:

- [ஒரு கொள்கலனுக்கான (Container) சுற்றுச்சூழல் மாறிகளை (environment variables) அமைக்கவும்](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
- [Pod-களுக்கு SSH திறவுகோல்கள் அல்லது கடவுச்சொற்கள் போன்ற அடையாள சான்றுகளை (credentials) வழங்கவும்](/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds).
- [தனியார் பதிவேடுகளிலிருந்து (private registries) கொள்கலன் படங்களை (container images) இழுக்க kubelet-ஐ அனுமதிக்கவும்](/docs/tasks/configure-pod-container/pull-image-private-registry/).

Kubernetes கட்டுப்பாட்டு தளமும் (Control Plane) Secret-களைப் பயன்படுத்துகிறது; எடுத்துக்காட்டாக,
[bootstrap token Secret-கள்](#bootstrap-token-secrets) என்பது கணு பதிவை (node registration)
தானியக்கமாக்க உதவும் ஒரு வழிமுறையாகும்.

### பயன்பாட்டு நிலை: Secret தொகுதியில் dotfiles {#use-case-dotfiles-in-a-secret-volume}

ஒரு புள்ளியுடன் (dot) தொடங்கும் key-யை வரையறுப்பதன் மூலம் உங்கள் தரவை "மறைக்க"
முடியும். இந்த key ஒரு dotfile அல்லது "மறைக்கப்பட்ட" கோப்பைக் குறிக்கிறது. எடுத்துக்காட்டாக,
பின்வரும் Secret ஒரு தொகுதியில் (Volume) ஏற்றப்படும்போது, `secret-volume`, அந்த தொகுதியில்
`.secret-file` என்ற ஒரே ஒரு கோப்பு இருக்கும், மேலும் `dotfile-test-container`-க்கு
`/etc/secret-volume/.secret-file` என்ற பாதையில் இந்த கோப்பு கிடைக்கும்.

{{< note >}}
புள்ளி எழுத்துகளுடன் தொடங்கும் கோப்புகள் `ls -l` வெளியீட்டிலிருந்து மறைக்கப்படும்;
கோப்பக உள்ளடக்கங்களை பட்டியலிடும்போது அவற்றைக் காண `ls -la` பயன்படுத்த வேண்டும்.
{{< /note >}}

{{% code language="yaml" file="secret/dotfile-secret.yaml" %}}

### பயன்பாட்டு நிலை: Pod-இல் ஒரு கொள்கலனுக்கு மட்டும் தெரியும் Secret {#use-case-secret-visible-to-one-container-in-a-pod}

HTTP கோரிக்கைகளை கையாளவும், சிக்கலான வணிக தர்க்கத்தை செய்யவும், பின்னர்
HMAC-உடன் சில செய்திகளில் கையொப்பம் இடவும் வேண்டிய ஒரு திட்டத்தை கவனியுங்கள்.
சிக்கலான பயன்பாட்டு தர்க்கம் இருப்பதால், சேவையகத்தில் கவனிக்கப்படாத
தொலைநிலை கோப்பு வாசிப்பு சுரண்டல் (remote file reading exploit) இருக்கலாம்,
இது தனியார் திறவுகோலை (private key) ஒரு தாக்குதல் நடத்துபவருக்கு வெளிப்படுத்தலாம்.

இதை இரண்டு கொள்கலன்களில் (Containers) இரண்டு செயல்முறைகளாக பிரிக்கலாம்: ஒரு frontend
கொள்கலன், இது பயனர் தொடர்பு மற்றும் வணிக தர்க்கத்தை கையாளும், ஆனால் தனியார்
திறவுகோலை காண முடியாது; மற்றும் ஒரு signer கொள்கலன், இது தனியார் திறவுகோலை
காணலாம், மேலும் frontend-ஐ சுரண்டல் கோரிக்கைகளுக்கு பதிலளிக்கும் (எடுத்துக்காட்டாக,
localhost வலையமைப்பு வழியாக).

இந்த பிரிக்கப்பட்ட அணுகுமுறையில், ஒரு தாக்குதல் நடத்துபவர் பயன்பாட்டு சேவையகத்தை
தன்னிச்சையான சில செயல்களை செய்யும்படி ஏமாற்ற வேண்டியிருக்கும், இது ஒரு கோப்பை
படிக்கும்படி வைப்பதை விட கஷ்டமாக இருக்கலாம்.

### Secret-களுக்கு மாற்றுகள் (Alternatives to Secrets) {#alternatives-to-secrets}

இரகசியத் தரவைப் பாதுகாக்க Secret பயன்படுத்துவதற்கு பதிலாக மாற்று வழிகளை தேர்வு செய்யலாம்.

உங்கள் சில விருப்பங்கள் இங்கே:

- உங்கள் cloud-native கூறு அதே Kubernetes கொத்தில் (Cluster) இயங்கும் என்று தெரிந்த
  மற்றொரு பயன்பாட்டிற்கு அங்கீகரிக்க வேண்டும் என்றால், ஒரு
  [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  மற்றும் அதன் டோக்கன்களை (tokens) உங்கள் கிளையண்டை அடையாளப்படுத்த பயன்படுத்தலாம்.
- உணர்திறன் வாய்ந்த தரவை நிர்வகிக்கும் மூன்றாம் தரப்பு கருவிகளை (third-party tools) இயக்கலாம்,
  உங்கள் கொத்திற்கு (Cluster) உள்ளேயோ அல்லது வெளியிலேயோ. எடுத்துக்காட்டாக, ஒரு சேவை,
  Pod-கள் HTTPS வழியாக அணுகுகின்றன, கிளையண்ட் சரியாக அங்கீகரித்தால் ஒரு Secret-ஐ
  வெளிப்படுத்துகிறது (எடுத்துக்காட்டாக, ServiceAccount டோக்கனுடன்).
- அங்கீகரிப்புக்கு, X.509 சான்றிதழ்களுக்கான (X.509 certificates) தனிப்பயன் கையொப்பமிடுபவரை (custom signer)
  செயல்படுத்தி, தேவைப்படும் Pod-களுக்கு சான்றிதழ்கள் வழங்க
  [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  பயன்படுத்தலாம்.
- குறிப்பிட்ட Pod-களுக்கு கணு-உள்ளூர் (node-local) குறியாக்க வன்பொருளை வெளிப்படுத்த
  ஒரு [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  பயன்படுத்தலாம். எடுத்துக்காட்டாக, நம்பகமான கணுக்களில் (nodes) Trusted Platform Module கொண்ட
  நம்பகமான Pod-களை திட்டமிடலாம்.

அந்த விருப்பங்களில் இரண்டு அல்லது அதிகமானவற்றை, Secret பொருள்களை பயன்படுத்தும் விருப்பம்
உட்பட, இணைத்தும் பயன்படுத்தலாம்.

எடுத்துக்காட்டாக: ஒரு {{< glossary_tooltip text="operator" term_id="operator-pattern" >}}-ஐ
செயல்படுத்துங்கள் (அல்லது பயன்படுத்துங்கள்), இது வெளிப்புற சேவையிலிருந்து குறுகிய-வாழ்நாள்
session டோக்கன்களை பெற்று, பின்னர் அந்த குறுகிய-வாழ்நாள் session டோக்கன்களின் அடிப்படையில்
Secret-களை உருவாக்குகிறது. உங்கள் கொத்தில் (Cluster) இயங்கும் Pod-கள் session டோக்கன்களைப்
பயன்படுத்தலாம், மேலும் operator அவை செல்லுபடியாகின்றன என்பதை உறுதிசெய்கிறது. இந்த
பிரிவு என்னவெனில், அந்த session டோக்கன்களை வழங்குவதற்கும் புதுப்பிப்பதற்கும் உள்ள
சரியான வழிமுறைகளை அறியாத Pod-களை இயக்கலாம்.

## Secret-களின் வகைகள் (Types of Secret) {#secret-types}

ஒரு Secret உருவாக்கும்போது, [Secret](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)
வளத்தின் `type` புலத்தைப் பயன்படுத்தி அல்லது சில சமகாலமான `kubectl` கட்டளை வரி கொடிகள்
(கிடைக்கும் பட்சத்தில்) மூலம் அதன் வகையை குறிப்பிடலாம். Secret வகை, Secret தரவை
நிரல் ரீதியாக கையாளுவதை எளிதாக்கப் பயன்படுகிறது.

Kubernetes சில பொதுவான பயன்பாட்டு காட்சிகளுக்காக பல உள்ளமைக்கப்பட்ட வகைகளை (built-in types) வழங்குகிறது.
இந்த வகைகள் செய்யப்படும் சரிபார்ப்புகள் (validations) மற்றும் Kubernetes விதிக்கும்
கட்டுப்பாடுகளின் (constraints) அடிப்படையில் வேறுபடுகின்றன.

| உள்ளமைக்கப்பட்ட வகை (Built-in Type)   | பயன்பாடு (Usage)                           |
| ------------------------------------- |------------------------------------------- |
| `Opaque`                              | தன்னிச்சையான பயனர் வரையறுத்த தரவு         |
| `kubernetes.io/service-account-token` | ServiceAccount டோக்கன்                     |
| `kubernetes.io/dockercfg`             | தொடர்மாக்கப்பட்ட `~/.dockercfg` கோப்பு    |
| `kubernetes.io/dockerconfigjson`      | தொடர்மாக்கப்பட்ட `~/.docker/config.json` கோப்பு |
| `kubernetes.io/basic-auth`            | அடிப்படை அங்கீகரிப்புக்கான (basic authentication) சான்றுகள் |
| `kubernetes.io/ssh-auth`              | SSH அங்கீகரிப்புக்கான (SSH authentication) சான்றுகள் |
| `kubernetes.io/tls`                   | TLS கிளையண்ட் அல்லது சேவையகத்திற்கான தரவு  |
| `bootstrap.kubernetes.io/token`       | bootstrap டோக்கன் தரவு                    |

ஒரு Secret பொருளுக்கான `type` மதிப்பாக காலியற்ற சரம் (non-empty string) ஒதுக்குவதன் மூலம்
உங்கள் சொந்த Secret வகையை வரையறுத்து பயன்படுத்தலாம் (காலி சரம் `Opaque` வகையாக கருதப்படும்).

Kubernetes வகை பெயரில் எந்த கட்டுப்பாடும் விதிக்கவில்லை. இருப்பினும், உள்ளமைக்கப்பட்ட
வகைகளில் ஒன்றை பயன்படுத்தினால், அந்த வகைக்கு வரையறுக்கப்பட்ட அனைத்து தேவைகளையும்
பூர்த்தி செய்ய வேண்டும்.

பொது பயன்பாட்டிற்கான Secret வகையை வரையறுக்கும்போது, வழக்கத்தை பின்பற்றி
`/` ஆல் பிரிக்கப்பட்ட பெயருக்கு முன்பு உங்கள் டொமைன் பெயரை வைக்கவும்.
எடுத்துக்காட்டாக: `cloud-hosting.example.net/cloud-api-credentials`.

### Opaque Secret-கள் (Opaque Secrets) {#opaque-secrets}

ஒரு Secret அறிவிப்பு கோப்பில் (manifest) வகையை வெளிப்படையாக குறிப்பிடாவிட்டால்,
`Opaque` என்பது இயல்புநிலை Secret வகையாகும். `kubectl` பயன்படுத்தி Secret உருவாக்கும்போது,
ஒரு `Opaque` Secret வகையை குறிக்க `generic` துணைக்கட்டளையை (subcommand) பயன்படுத்த வேண்டும்.
எடுத்துக்காட்டாக, பின்வரும் கட்டளை `Opaque` வகையின் காலி Secret ஒன்றை உருவாக்குகிறது:

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

வெளியீடு இப்படி இருக்கும்:

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

`DATA` நெடுவரிசை Secret-இல் சேமிக்கப்பட்ட தரவு உருப்படிகளின் எண்ணிக்கையை காட்டுகிறது.
இந்த நிலையில், `0` என்பது காலி Secret உருவாக்கியிருக்கிறீர்கள் என்பதை குறிக்கிறது.

### ServiceAccount டோக்கன் Secret-கள் (ServiceAccount token Secrets) {#serviceaccount-token-secrets}

`kubernetes.io/service-account-token` வகையான Secret ஒரு
{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}-ஐ அடையாளப்படுத்தும்
டோக்கன் சான்றுகளை (token credential) சேமிக்கப் பயன்படுகிறது. இது Pod-களுக்கு நீண்ட-ஆயுள்
ServiceAccount சான்றுகளை வழங்கும் ஒரு பழைய வழிமுறையாகும்.

Kubernetes v1.22 மற்றும் அதற்கு பிந்தைய பதிப்புகளில், பரிந்துரைக்கப்பட்ட அணுகுமுறை
[`TokenRequest`](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API-ஐ
பயன்படுத்தி குறுகிய-வாழ்நாள், தன்னியக்கமாக சுழலும் ServiceAccount டோக்கனை பெறுவதாகும்.
பின்வரும் முறைகளில் இந்த குறுகிய-வாழ்நாள் டோக்கன்களை பெறலாம்:

* `TokenRequest` API-ஐ நேரடியாக அல்லது `kubectl` போன்ற API கிளையண்ட் மூலம் அழைக்கவும்.
  எடுத்துக்காட்டாக,
  [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
  கட்டளையைப் பயன்படுத்தலாம்.
* உங்கள் Pod அறிவிப்பு கோப்பில் (manifest) ஒரு
  [projected volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)-இல்
  ஏற்றப்பட்ட டோக்கனை கோரவும். Kubernetes டோக்கனை உருவாக்கி Pod-இல் ஏற்றுகிறது.
  அது ஏற்றப்பட்டிருக்கும் Pod நீக்கப்படும்போது டோக்கன் தானாக செல்லாமல் போகும்.
  விவரங்களுக்கு,
  [service account token projection பயன்படுத்தி Pod தொடங்குதல்](/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection) பார்க்கவும்.

{{< note >}}
ServiceAccount டோக்கன் Secret-ஐ `TokenRequest` API மூலம் டோக்கன் பெற முடியாத
நிலையில் மட்டுமே உருவாக்க வேண்டும், மேலும் படிக்கக்கூடிய API பொருளில்
காலாவதியாகாத டோக்கன் சான்றுகளை நிலைத்திருக்கும்படி சேமிப்பதன் பாதுகாப்பு அபாயம்
உங்களுக்கு ஏற்புடையதாக இருக்க வேண்டும். வழிமுறைகளுக்கு,
[ServiceAccount-க்கு நீண்ட-ஆயுள் API டோக்கனை கைமுறையாக உருவாக்குதல்](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount) பார்க்கவும்.
{{< /note >}}

இந்த Secret வகையைப் பயன்படுத்தும்போது, `kubernetes.io/service-account.name` குறிப்பு (annotation)
ஏற்கனவே இருக்கும் ServiceAccount பெயருக்கு அமைக்கப்பட்டுள்ளதா என்பதை உறுதிசெய்ய வேண்டும்.
ServiceAccount மற்றும் Secret பொருட்களை இரண்டையும் உருவாக்கினால், முதலில் ServiceAccount
பொருளை உருவாக்க வேண்டும்.

Secret உருவாக்கப்பட்ட பிறகு, Kubernetes {{< glossary_tooltip text="controller" term_id="controller" >}}
`kubernetes.io/service-account.uid` குறிப்பு மற்றும் `data` புலத்தில் உள்ள `token` key போன்ற
சில மற்ற புலங்களை நிரப்புகிறது, இது அங்கீகரிப்பு டோக்கனுடன் நிரப்பப்படுகிறது.

பின்வரும் உதாரண உள்ளமைவு ஒரு ServiceAccount டோக்கன் Secret-ஐ அறிவிக்கிறது:

{{% code language="yaml" file="secret/serviceaccount-token-secret.yaml" %}}

Secret உருவாக்கிய பிறகு, Kubernetes `data` புலத்தில் `token` key-ஐ நிரப்பும் வரை காத்திருக்கவும்.

ServiceAccount-கள் எப்படி வேலை செய்கின்றன என்பது பற்றிய மேலும் தகவலுக்கு
[ServiceAccount](/docs/concepts/security/service-accounts/) ஆவணம் பார்க்கவும்.
Pod-களிலிருந்து ServiceAccount சான்றுகளை குறிப்பிடுவது பற்றிய தகவலுக்கு
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)-இன்
`automountServiceAccountToken` புலம் மற்றும் `serviceAccountName` புலத்தையும் சரிபார்க்கவும்.

### Docker config Secret-கள் (Docker config Secrets) {#docker-config-secrets}

கொள்கலன் படப் பதிவேட்டை (container image registry) அணுக சான்றுகளை சேமிக்க
ஒரு Secret உருவாக்குகிறீர்களென்றால், அந்த Secret-க்கு பின்வரும் `type` மதிப்புகளில் ஒன்றை
பயன்படுத்த வேண்டும்:

- `kubernetes.io/dockercfg`: Docker கட்டளை வரியை (Docker command line) உள்ளமைக்க
  பழைய வடிவமான `~/.dockercfg`-ஐ தொடர்மாக்கி (serialized) சேமிக்கிறது. Secret `data` புலத்தில்
  `.dockercfg` key இருக்க வேண்டும், அதன் மதிப்பு base64 குறியாக்கப்பட்ட `~/.dockercfg`
  கோப்பின் உள்ளடக்கமாகும்.
- `kubernetes.io/dockerconfigjson`: `~/.docker/config.json` கோப்பு வடிவத்தை பின்பற்றும்
  தொடர்மாக்கப்பட்ட (serialized) JSON-ஐ சேமிக்கிறது, இது `~/.dockercfg`-க்கான புதிய வடிவம்.
  Secret `data` புலத்தில் `.dockerconfigjson` key இருக்க வேண்டும், அதன் மதிப்பு
  base64 குறியாக்கப்பட்ட `~/.docker/config.json` கோப்பின் உள்ளடக்கமாகும்.

`kubernetes.io/dockercfg` வகை Secret-க்கான ஒரு உதாரணம் இங்கே உள்ளது:

{{% code language="yaml" file="secret/dockercfg-secret.yaml" %}}

{{< note >}}
base64 குறியாக்கம் செய்ய விரும்பாவிட்டால், `stringData` புலத்தை பயன்படுத்துவதை தேர்வு செய்யலாம்.
{{< /note >}}

ஒரு அறிவிப்பு கோப்பைப் (manifest) பயன்படுத்தி Docker config Secret-களை உருவாக்கும்போது,
API சேவையகம் (API server) `data` புலத்தில் எதிர்பார்க்கப்பட்ட key இருக்கிறதா என்று சரிபார்க்கிறது,
மேலும் வழங்கப்பட்ட மதிப்பை செல்லுபடியான JSON ஆக பாகுபடுத்த (parse) முடிகிறதா என்று சரிபார்க்கிறது.
JSON உண்மையில் Docker config கோப்பா என்பதை API சேவையகம் சரிபார்ப்பதில்லை.

Docker configuration கோப்பு இல்லாதபோது, கொள்கலன் பதிவேட்டை (container registry) அணுக
`kubectl` பயன்படுத்தியும் ஒரு Secret உருவாக்கலாம்:

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-email=tiger@acme.example \
  --docker-username=tiger \
  --docker-password=pass1234 \
  --docker-server=my-registry.example:5000
```

இந்த கட்டளை `kubernetes.io/dockerconfigjson` வகை Secret-ஐ உருவாக்குகிறது.

புதிய Secret-ஐலிருந்து `.data.dockerconfigjson` புலத்தை மீட்டெடுத்து தரவை
டீகோட் (decode) செய்யுங்கள்:

```shell
kubectl get secret secret-tiger-docker -o jsonpath='{.data.*}' | base64 -d
```

வெளியீடு பின்வரும் JSON ஆவணத்திற்கு சமானமாக இருக்கும் (இது ஒரு செல்லுபடியான
Docker configuration கோப்பும் கூட):

```json
{
  "auths": {
    "my-registry.example:5000": {
      "username": "tiger",
      "password": "pass1234",
      "email": "tiger@acme.example",
      "auth": "dGlnZXI6cGFzczEyMzQ="
    }
  }
}
```

{{< caution >}}
அங்கே உள்ள `auth` மதிப்பு base64 குறியாக்கம் செய்யப்பட்டுள்ளது; இது மறைக்கப்பட்டுள்ளது
ஆனால் இரகசியமல்ல. அந்த Secret-ஐ படிக்கக்கூடிய எவரும் பதிவேட்டு அணுகல் (registry access)
bearer டோக்கனை அறிந்துகொள்ளலாம்.

தேவையின்போது pull secret-களை மாறும் மற்றும் பாதுகாப்பாக வழங்க
[credential providers](/docs/tasks/administer-cluster/kubelet-credential-provider/) பயன்படுத்துமாறு
பரிந்துரைக்கப்படுகிறது.
{{< /caution >}}

### அடிப்படை அங்கீகரிப்பு Secret (Basic authentication Secret) {#basic-authentication-secret}

`kubernetes.io/basic-auth` வகை அடிப்படை அங்கீகரிப்புக்கு (basic authentication) தேவையான
சான்றுகளை சேமிக்க வழங்கப்படுகிறது. இந்த Secret வகையைப் பயன்படுத்தும்போது, Secret-இன்
`data` புலத்தில் பின்வரும் இரண்டு key-களில் ஒன்று இருக்க வேண்டும்:

- `username`: அங்கீகரிப்புக்கான பயனர் பெயர்
- `password`: அங்கீகரிப்புக்கான கடவுச்சொல் அல்லது டோக்கன்

மேற்கண்ட இரண்டு key-களுக்கும் மதிப்புகள் base64 குறியாக்கப்பட்ட சரங்களாகும்.
Secret அறிவிப்பு கோப்பில் (manifest) `stringData` புலத்தைப் பயன்படுத்தி தெளிவான உரை
உள்ளடக்கத்தையும் வழங்கலாம்.

பின்வரும் அறிவிப்பு கோப்பு அடிப்படை அங்கீகரிப்பு Secret-க்கான ஒரு உதாரணம்:

{{% code language="yaml" file="secret/basicauth-secret.yaml" %}}

{{< note >}}
Secret-க்கான `stringData` புலம் server-side apply உடன் சரியாக வேலை செய்வதில்லை.
{{< /note >}}

அடிப்படை அங்கீகரிப்பு Secret வகை வசதிக்காக மட்டுமே வழங்கப்படுகிறது.
அடிப்படை அங்கீகரிப்புக்கு பயன்படுத்தப்படும் சான்றுகளுக்கு `Opaque` வகை உருவாக்கலாம்.
இருப்பினும், வரையறுக்கப்பட்ட மற்றும் பொதுவான Secret வகையை (`kubernetes.io/basic-auth`)
பயன்படுத்துவது மற்றவர்கள் உங்கள் Secret-இன் நோக்கத்தை புரிந்துகொள்ள உதவுகிறது,
மேலும் எந்த key பெயர்களை எதிர்பார்க்கலாம் என்பதற்கான மரபை (convention) நிறுவுகிறது.

### SSH அங்கீகரிப்பு Secret-கள் (SSH authentication Secrets) {#ssh-authentication-secrets}

உள்ளமைக்கப்பட்ட வகை `kubernetes.io/ssh-auth` SSH அங்கீகரிப்பில் பயன்படுத்தப்படும்
தரவை சேமிக்க வழங்கப்படுகிறது. இந்த Secret வகையைப் பயன்படுத்தும்போது, SSH சான்றுகளாக
`data` (அல்லது `stringData`) புலத்தில் ஒரு `ssh-privatekey` key-value இணையை குறிப்பிட வேண்டும்.

பின்வரும் அறிவிப்பு கோப்பு SSH பொது/தனியார் திறவுகோல் (public/private key) அங்கீகரிப்புக்கு
பயன்படுத்தப்படும் Secret-க்கான ஒரு உதாரணம்:

{{% code language="yaml" file="secret/ssh-auth-secret.yaml" %}}

SSH அங்கீகரிப்பு Secret வகை வசதிக்காக மட்டுமே வழங்கப்படுகிறது.
SSH அங்கீகரிப்புக்கு பயன்படுத்தப்படும் சான்றுகளுக்கு `Opaque` வகை உருவாக்கலாம்.
இருப்பினும், வரையறுக்கப்பட்ட மற்றும் பொதுவான Secret வகையை (`kubernetes.io/ssh-auth`)
பயன்படுத்துவது மற்றவர்கள் உங்கள் Secret-இன் நோக்கத்தை புரிந்துகொள்ள உதவுகிறது,
மேலும் எந்த key பெயர்களை எதிர்பார்க்கலாம் என்பதற்கான மரபை நிறுவுகிறது.
Kubernetes API இந்த வகை Secret-க்கு தேவையான key-கள் அமைக்கப்பட்டுள்ளனவா என்று சரிபார்க்கிறது.

{{< caution >}}
SSH தனியார் திறவுகோல்கள் (SSH private keys) தாமே SSH கிளையண்ட்க்கும்
host சேவையகத்துக்கும் (host server) இடையே நம்பகமான தகவல் தொடர்பை (trusted communication)
ஏற்படுத்துவதில்லை. "man in the middle" தாக்குதல்களை குறைக்க, `known_hosts` கோப்பை
ConfigMap-ல் சேர்ப்பது போன்ற நம்பிக்கையை நிறுவுவதற்கான இரண்டாம் தர வழிமுறை தேவைப்படுகிறது.
{{< /caution >}}

### TLS Secret-கள் (TLS Secrets) {#tls-secrets}

`kubernetes.io/tls` Secret வகை, பொதுவாக TLS-க்குப் பயன்படுத்தப்படும் சான்றிதழ் (certificate)
மற்றும் அதனுடன் தொடர்புடைய திறவுகோலை (key) சேமிக்கப் பயன்படுகிறது.

TLS Secret-களுக்கான ஒரு பொதுவான பயன்பாடு என்னவென்றால், ஒரு
[Ingress](/docs/concepts/services-networking/ingress/)-க்கு போக்குவரத்தில் குறியாக்கத்தை
(encryption in transit) உள்ளமைப்பதாகும், ஆனால் மற்ற வளங்களுடன் அல்லது உங்கள் பணிச்சுமையில்
(workload) நேரடியாகவும் பயன்படுத்தலாம்.
இந்த வகை Secret பயன்படுத்தும்போது, Secret உள்ளமைவின் `data` (அல்லது `stringData`)
புலத்தில் `tls.key` மற்றும் `tls.crt` key-கள் வழங்கப்பட வேண்டும், ஆனால் API சேவையகம்
ஒவ்வொரு key-க்கும் உண்மையான மதிப்புகளை சரிபார்ப்பதில்லை.

`stringData` பயன்படுத்துவதற்கு மாற்றாக, base64 குறியாக்கப்பட்ட சான்றிதழ் மற்றும்
தனியார் திறவுகோலை வழங்க `data` புலத்தை பயன்படுத்தலாம். விவரங்களுக்கு
[Secret பெயர்கள் மற்றும் தரவில் கட்டுப்பாடுகள்](#restriction-names-data) பார்க்கவும்.

பின்வரும் YAML, TLS Secret-க்கான ஒரு உதாரண உள்ளமைவை உள்ளடக்கியது:

{{% code language="yaml" file="secret/tls-auth-secret.yaml" %}}

TLS Secret வகை வசதிக்காக மட்டுமே வழங்கப்படுகிறது.
TLS அங்கீகரிப்புக்கு பயன்படுத்தப்படும் சான்றுகளுக்கு `Opaque` வகை உருவாக்கலாம்.
இருப்பினும், வரையறுக்கப்பட்ட மற்றும் பொதுவான Secret வகையை (`kubernetes.io/tls`)
பயன்படுத்துவது உங்கள் திட்டத்தில் Secret வடிவத்தின் நிலைத்தன்மையை உறுதிசெய்ய உதவுகிறது.
இந்த வகை Secret-க்கு தேவையான key-கள் அமைக்கப்பட்டுள்ளனவா என்று API சேவையகம் சரிபார்க்கிறது.

`kubectl` பயன்படுத்தி TLS Secret உருவாக்க, `tls` துணைக்கட்டளையை (subcommand) பயன்படுத்துங்கள்:

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

பொது/தனியார் திறவுகோல் இணை (public/private key pair) முன்பே இருக்க வேண்டும்.
`--cert`-க்கான பொது திறவுகோல் சான்றிதழ் (public key certificate) .PEM குறியாக்கமாக
இருக்க வேண்டும் மற்றும் கொடுக்கப்பட்ட தனியார் திறவுகோலுடன் (private key) பொருந்த வேண்டும்.

### Bootstrap டோக்கன் Secret-கள் (Bootstrap token Secrets) {#bootstrap-token-secrets}

`bootstrap.kubernetes.io/token` Secret வகை கணு bootstrap செயல்முறையின் (node bootstrap process)
போது பயன்படுத்தப்படும் டோக்கன்களுக்கானது. இது நன்கு அறியப்பட்ட ConfigMap-களில் கையொப்பமிட
(sign) பயன்படுத்தப்படும் டோக்கன்களை சேமிக்கிறது.

ஒரு bootstrap டோக்கன் Secret பொதுவாக `kube-system` பெயரிடல் வெளியில் (Namespace) உருவாக்கப்படுகிறது
மற்றும் `bootstrap-token-<token-id>` வடிவத்தில் பெயரிடப்படுகிறது, இங்கே `<token-id>` என்பது
டோக்கன் ID-யின் 6 எழுத்துகள் கொண்ட சரமாகும்.

ஒரு Kubernetes அறிவிப்பு கோப்பாக (manifest), ஒரு bootstrap டோக்கன் Secret இப்படி இருக்கலாம்:

{{% code language="yaml" file="secret/bootstrap-token-secret-base64.yaml" %}}

ஒரு bootstrap டோக்கன் Secret `data`-இன் கீழ் பின்வரும் key-களை கொண்டிருக்கிறது:

- `token-id`: டோக்கன் அடையாளமாக (token identifier) சீரற்ற 6 எழுத்துகள் கொண்ட சரம். தேவையானது.
- `token-secret`: உண்மையான டோக்கன் Secret-ஆக சீரற்ற 16 எழுத்துகள் கொண்ட சரம். தேவையானது.
- `description`: டோக்கன் எதற்காக பயன்படுத்தப்படுகிறது என்று விவரிக்கும் மனிதர் படிக்கக்கூடிய சரம். விருப்பமானது.
- `expiration`: டோக்கன் எப்போது காலாவதியாக வேண்டும் என்று குறிப்பிடும் [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339) பயன்படுத்தும் முழுமையான UTC நேரம். விருப்பமானது.
- `usage-bootstrap-<usage>`: bootstrap டோக்கனுக்கான கூடுதல் பயன்பாட்டை குறிக்கும் boolean flag.
- `auth-extra-groups`: `system:bootstrappers` குழுவிற்கு கூடுதலாக அங்கீகரிக்கப்படும்
  குழு பெயர்களின் கமாவால் பிரிக்கப்பட்ட பட்டியல்.

Secret-இன் `stringData` புலத்தில் base64 குறியாக்கம் செய்யாமல் மதிப்புகளை
வழங்குவதை மாற்றாகவும் தேர்வு செய்யலாம்:

{{% code language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

{{< note >}}
Secret-க்கான `stringData` புலம் server-side apply உடன் சரியாக வேலை செய்வதில்லை.
{{< /note >}}

## Secret-களுடன் பணியாடல் (Working with Secrets) {#working-with-secrets}

### ஒரு Secret உருவாக்குதல் (Creating a Secret) {#creating-a-secret}

ஒரு Secret உருவாக்க பல விருப்பங்கள் உள்ளன:

- [`kubectl` பயன்படுத்துதல்](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [உள்ளமைவு கோப்பு பயன்படுத்துதல்](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [Kustomize கருவி பயன்படுத்துதல்](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

#### Secret பெயர்கள் மற்றும் தரவில் கட்டுப்பாடுகள் {#restriction-names-data}

ஒரு Secret பொருளின் பெயர் செல்லுபடியான
[DNS subdomain பெயராக](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
இருக்க வேண்டும்.

ஒரு Secret-க்கான உள்ளமைவு கோப்பு உருவாக்கும்போது `data` மற்றும்/அல்லது `stringData` புலத்தை
குறிப்பிடலாம். `data` மற்றும் `stringData` புலங்கள் விருப்பமானவை (optional).
`data` புலத்தில் உள்ள அனைத்து key-களுக்கும் மதிப்புகள் base64 குறியாக்கப்பட்ட சரங்களாக
இருக்க வேண்டும். base64 சரமாக மாற்றம் விரும்பாவிட்டால், எந்த சரங்களையும் மதிப்புகளாக
ஏற்கும் `stringData` புலத்தை குறிப்பிட தேர்வு செய்யலாம்.

`data` மற்றும் `stringData`-இன் key-கள் alphanumeric எழுத்துகள், `-`, `_` அல்லது `.`
ஆகியவற்றால் ஆனதாக இருக்க வேண்டும். `stringData` புலத்தில் உள்ள அனைத்து key-value இணைகளும்
உள்ளிணைப்பாக `data` புலத்தில் ஒன்றிணைக்கப்படுகின்றன. ஒரு key `data` மற்றும் `stringData`
இரண்டிலும் தோன்றினால், `stringData` புலத்தில் குறிப்பிட்ட மதிப்து முன்னுரிமை பெறும்.

#### அளவு வரம்பு (Size limit) {#restriction-data-size}

தனிப்பட்ட Secret-கள் அளவில் 1MiB-க்கு மட்டுப்படுத்தப்பட்டுள்ளன. API சேவையகம் (API server)
மற்றும் kubelet நினைவகத்தை (memory) வற்றடிக்கும் மிகவும் பெரிய Secret-கள் உருவாக்கப்படுவதை
ஊக்கமட்டுத்தவே இது. இருப்பினும், பல சிறிய Secret-கள் உருவாக்கப்படுவதும் நினைவகத்தை
வற்றடிக்கலாம். ஒரு பெயரிடல் வெளியில் (Namespace) Secret-களின் (அல்லது மற்ற வளங்களின்)
எண்ணிக்கையை கட்டுப்படுத்த
[resource quota](/docs/concepts/policy/resource-quotas/) பயன்படுத்தலாம்.

### ஒரு Secret திருத்துதல் (Editing a Secret) {#editing-a-secret}

[மாற்றமுடியாதது (immutable)](#secret-immutable) என்று குறிக்கப்படாத வரை, ஏற்கனவே இருக்கும்
Secret-ஐ திருத்தலாம். ஒரு Secret திருத்த, பின்வரும் முறைகளில் ஒன்றை பயன்படுத்துங்கள்:

- [`kubectl` பயன்படுத்துதல்](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
- [உள்ளமைவு கோப்பு பயன்படுத்துதல்](/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)

[Kustomize கருவி](/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret) பயன்படுத்தியும்
Secret-இல் உள்ள தரவை திருத்தலாம். இருப்பினும், இந்த முறை திருத்தப்பட்ட தரவுடன்
ஒரு புதிய `Secret` பொருளை உருவாக்குகிறது.

Secret-ஐ எவ்வாறு உருவாக்கினீர்கள் என்பதையும், Secret Pod-களில் எவ்வாறு பயன்படுத்தப்படுகிறது
என்பதையும் பொறுத்து, ஏற்கனவே இருக்கும் `Secret` பொருள்களுக்கான புதுப்பிப்புகள்
தரவைப் பயன்படுத்தும் Pod-களுக்கு தானாக பரப்பப்படும். மேலும் தகவலுக்கு,
[Pod-ஐலிருந்து கோப்புகளாக Secret-களைப் பயன்படுத்துதல்](#using-secrets-as-files-from-a-pod) பகுதி பார்க்கவும்.

### ஒரு Secret பயன்படுத்துதல் (Using a Secret) {#using-a-secret}

Secret-களை தரவு தொகுதிகளாக (data volumes) ஏற்றலாம் அல்லது Pod-இல் உள்ள ஒரு கொள்கலனால்
(Container) பயன்படுத்தப்படும்
{{< glossary_tooltip text="சுற்றுச்சூழல் மாறிகளாக" term_id="container-env-variables" >}}
(environment variables) வெளிப்படுத்தலாம். Secret-களை நேரடியாக Pod-க்கு வெளிப்படுத்தாமல்
கணினியின் மற்ற பகுதிகளாலும் பயன்படுத்தப்படலாம். எடுத்துக்காட்டாக, Secret-கள் மற்ற
கணினி பகுதிகள் உங்கள் சார்பாக வெளிப்புற கணினிகளுடன் (external systems) தொடர்புகொள்ள
பயன்படுத்த வேண்டிய சான்றுகளை (credentials) வைத்திருக்கலாம்.

Secret தொகுதி மூலங்கள் (Secret volume sources) குறிப்பிட்ட பொருள் குறிப்பு (object reference)
உண்மையில் Secret வகை பொருளை சுட்டுகிறதா என்று சரிபார்க்கப்படுகின்றன. எனவே,
ஒரு Secret-ஐ சார்ந்த எந்த Pod-கள் வருவதற்கும் முன்பு அந்த Secret உருவாக்கப்பட வேண்டும்.

Secret மீட்டெடுக்க முடியாவிட்டால் (அது இல்லாததால் அல்லது API சேவையகத்திற்கு (API server)
தற்காலிக இணைப்பு இல்லாமையால்), kubelet அந்த Pod-ஐ இயக்கும் முயற்சியை இடைவிடாமல் மீண்டும்
மீண்டும் செய்கிறது. kubelet அந்த Pod-க்கான ஒரு நிகழ்வையும் (Event) புகாரளிக்கிறது,
Secret மீட்டெடுப்பதில் உள்ள சிக்கல் விவரங்களுடன்.

#### விருப்பத்தேர்வு Secret-கள் (Optional Secrets) {#restriction-secret-must-exist}

Pod-இல் ஒரு Secret குறிப்பிடும்போது, பின்வரும் உதாரணத்தில் உள்ளது போல்
Secret-ஐ _விருப்பத்தேர்வு_ (optional) என்று குறிக்கலாம். விருப்பத்தேர்வான Secret இல்லாவிட்டால்,
Kubernetes அதை புறக்கணிக்கிறது.

{{% code language="yaml" file="secret/optional-secret.yaml" %}}

இயல்பாக, Secret-கள் தேவையானவை. விருப்பத்தேர்வற்ற அனைத்து Secret-களும் கிடைக்கும் வரை
Pod-இன் எந்த கொள்கலனும் (Container) தொடங்காது.

ஒரு Pod விருப்பத்தேர்வற்ற Secret-இல் குறிப்பிட்ட ஒரு key-ஐ குறிப்பிட்டால் மற்றும் அந்த
Secret இருக்கும், ஆனால் குறிப்பிட்ட பெயரில் key இல்லாவிட்டால், Pod தொடக்கத்தில் தோல்வியடையும்.

### Pod-ஐலிருந்து கோப்புகளாக Secret-களைப் பயன்படுத்துதல் {#using-secrets-as-files-from-a-pod}

Pod-இல் ஒரு Secret-ஐலிருந்து தரவை அணுக விரும்பினால், ஒரு வழி என்னவென்றால்
Kubernetes அந்த Secret-இன் மதிப்பை Pod-இன் ஒரு அல்லது அதிக கொள்கலன்களின் (Containers)
கோப்பு அமைப்பில் (filesystem) ஒரு கோப்பாக கிடைக்கும்படி செய்வதாகும்.

வழிமுறைகளுக்கு,
[Secret தரவை Volume வழியாக அணுக ஒரு Pod உருவாக்குதல்](/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume) பார்க்கவும்.

ஒரு தொகுதி (Volume) ஒரு Secret-ஐலிருந்து தரவை உள்ளடக்கும்போது, அந்த Secret புதுப்பிக்கப்பட்டால்,
Kubernetes இதை கண்காணித்து இறுதி-நிலைத்தன்மை (eventually-consistent) அணுகுமுறையைப் பயன்படுத்தி
தொகுதியில் உள்ள தரவை புதுப்பிக்கிறது.

{{< note >}}
[subPath](/docs/concepts/storage/volumes#using-subpath) தொகுதி ஏற்றமாக (volume mount)
Secret பயன்படுத்தும் ஒரு கொள்கலன் (Container) தானியக்க Secret புதுப்பிப்புகளை பெறாது.
{{< /note >}}

kubelet அந்த கணுவில் (node) உள்ள Pod-களுக்கான தொகுதிகளில் (volumes) பயன்படுத்தப்படும்
Secret-களுக்கான தற்போதைய key-கள் மற்றும் மதிப்புகளின் இட-நினைவகத்தை (cache) வைத்திருக்கிறது.
இட-நினைவகப்பட்ட மதிப்புகளிலிருந்து மாற்றங்களை kubelet கண்டறியும் விதத்தை உள்ளமைக்கலாம்.
[kubelet உள்ளமைவில்](/docs/reference/config-api/kubelet-config.v1beta1/) உள்ள
`configMapAndSecretChangeDetectionStrategy` புலம் kubelet எந்த உத்தியைப் (strategy)
பயன்படுத்துகிறது என்பதை கட்டுப்படுத்துகிறது. இயல்புநிலை உத்தி `Watch` ஆகும்.

Secret-களுக்கான புதுப்பிப்புகள் API watch வழிமுறையால் (இயல்புநிலை), வரையறுக்கப்பட்ட
time-to-live கொண்ட இட-நினைவகத்தின் அடிப்படையில், அல்லது ஒவ்வொரு kubelet ஒத்திசைவு
சுழற்சியிலும் (synchronisation loop) கொத்து API சேவையகத்திலிருந்து (cluster API server)
நேர்மறையாக கணிக்கப்படுவதன் (polled) மூலம் பரப்பப்படலாம்.

இதன் விளைவாக, Secret புதுப்பிக்கப்படும் தருணத்திலிருந்து புதிய key-கள் Pod-களுக்கு
projected ஆகும் வரையான மொத்த தாமதம் kubelet sync காலம் + இட-நினைவக பரவல் தாமதம்
ஆகியவற்றைப் போல் நீளமாக இருக்கலாம், இங்கே இட-நினைவக பரவல் தாமதம் தேர்ந்தெடுக்கப்பட்ட
இட-நினைவக வகையைப் பொறுத்தது (முந்தைய பத்தியில் பட்டியலிட்ட அதே வரிசையை பின்பற்றி,
இவை: watch பரவல் தாமதம், உள்ளமைக்கப்பட்ட இட-நினைவக TTL, அல்லது நேரடி கணிப்புக்கு பூஜ்யம்).

### சுற்றுச்சூழல் மாறிகளாக Secret-களைப் பயன்படுத்துதல் (Using Secrets as environment variables) {#using-secrets-as-environment-variables}

Pod-இல் ஒரு
{{< glossary_tooltip text="சுற்றுச்சூழல் மாறியில்" term_id="container-env-variables" >}}
(environment variable) ஒரு Secret பயன்படுத்த:

1. உங்கள் Pod spec-இல் உள்ள ஒவ்வொரு கொள்கலனுக்கும் (Container), பயன்படுத்த விரும்பும்
   ஒவ்வொரு Secret key-க்கும் `env[].valueFrom.secretKeyRef` புலத்தில் ஒரு சுற்றுச்சூழல்
   மாறியை சேர்க்கவும்.
1. குறிப்பிட்ட சுற்றுச்சூழல் மாறிகளில் மதிப்புகளை திட்டம் தேடும் வகையில்
   படத்தையும்/அல்லது கட்டளை வரியையும் மாற்றவும்.

வழிமுறைகளுக்கு,
[Secret தரவைப் பயன்படுத்தி கொள்கலன் சுற்றுச்சூழல் மாறிகளை வரையறுத்தல்](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data) பார்க்கவும்.

Pod-களில் சுற்றுச்சூழல் மாறி பெயர்களுக்கு அனுமதிக்கப்படும் எழுத்துகளின் வரம்பு
[கட்டுப்படுத்தப்பட்டுள்ளது](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config)
என்பதை கவனிக்க வேண்டும்.
எந்த key-களும் விதிகளை பூர்த்தி செய்யாவிட்டால், அந்த key-கள் உங்கள் கொள்கலனுக்கு
கிடைக்காது, ஆனால் Pod தொடங்கலாம்.

### கொள்கலன் படம் pull செய்யும் Secret-கள் (Container image pull Secrets) {#using-imagepullsecrets}

தனியார் களஞ்சியத்திலிருந்து (private repository) கொள்கலன் படங்களை (container images)
மீட்டெடுக்க விரும்பினால், ஒவ்வொரு கணுவிலும் (node) உள்ள kubelet அந்த களஞ்சியத்திற்கு
அங்கீகரிக்க ஒரு வழி தேவைப்படுகிறது. இதை சாத்தியமாக்க _image pull Secret-களை_ உள்ளமைக்கலாம்.
இந்த Secret-கள் Pod நிலையில் உள்ளமைக்கப்படுகின்றன.

#### imagePullSecrets பயன்படுத்துதல் (Using imagePullSecrets) {#using-imagepullsecrets-field}

`imagePullSecrets` புலம் அதே பெயரிடல் வெளியில் (Namespace) உள்ள Secret-களுக்கான
குறிப்புகளின் பட்டியலாகும். Docker (அல்லது மற்ற) படப் பதிவேட்டு (image registry)
கடவுச்சொல்லை kubelet-க்கு அனுப்ப `imagePullSecrets` பயன்படுத்தலாம்.
உங்கள் Pod-இன் சார்பாக kubelet தனியார் படத்தை (private image) இழுக்க இந்த தகவலை பயன்படுத்துகிறது.
`imagePullSecrets` புலம் பற்றிய மேலும் தகவலுக்கு
[PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
பார்க்கவும்.

##### imagePullSecret-ஐ கைமுறையாக குறிப்பிடுதல் (Manually specifying an imagePullSecret) {#manually-specifying-an-imagepullsecret}

[கொள்கலன் படங்கள்](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
ஆவணத்திலிருந்து `imagePullSecrets` எவ்வாறு குறிப்பிடுவது என்பதை அறியலாம்.

##### imagePullSecrets-ஐ தானியக்கமாக இணைக்க ஏற்பாடு செய்தல் (Arranging for imagePullSecrets to be automatically attached) {#arranging-for-imagepullsecrets-to-be-automatically-attached}

`imagePullSecrets`-ஐ கைமுறையாக உருவாக்கி, ஒரு ServiceAccount-ஐலிருந்து இவற்றை குறிப்பிடலாம்.
அந்த ServiceAccount மூலம் உருவாக்கப்படும் அல்லது இயல்பாக அந்த ServiceAccount கொண்ட எந்த
Pod-ஐலும் `imagePullSecrets` புலம் service account-இன் மதிப்பிற்கு அமைக்கப்படும்.
இந்த செயல்முறையின் விரிவான விளக்கத்திற்கு
[service account-க்கு ImagePullSecrets சேர்க்கவும்](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
பார்க்கவும்.

### static Pod-களுடன் Secret-களைப் பயன்படுத்துதல் (Using Secrets with static Pods) {#restriction-static-pod}

{{< glossary_tooltip text="static Pod-களுடன்" term_id="static-pod" >}} ConfigMap அல்லது
Secret-களைப் பயன்படுத்த முடியாது.

## மாற்றமுடியாத Secret-கள் (Immutable Secrets) {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Kubernetes குறிப்பிட்ட Secret-களை (மற்றும் ConfigMap-களை) _மாற்றமுடியாதவை_ (immutable) என்று
குறிக்க அனுமதிக்கிறது.
ஏற்கனவே இருக்கும் Secret-இன் தரவை மாற்றுவதை தடுப்பதால் பின்வரும் நன்மைகள் கிடைக்கின்றன்:

- பயன்பாட்டு இடையூறுகளை (application outages) ஏற்படுத்தக்கூடிய தற்செயலான (அல்லது தேவையற்ற)
  புதுப்பிப்புகளிலிருந்து பாதுகாக்கிறது
- (Secret-களை பரவலாகப் பயன்படுத்தும் கொத்துகளுக்கு (Clusters) - குறைந்தபட்சம் பல பத்தாயிரம்
  தனித்தனி Secret-கல் Pod ஏற்றல்கள்), மாற்றமுடியாத Secret-களுக்கு மாறுவது kube-apiserver-இன்
  சுமையை கணிசமாக குறைப்பதன் மூலம் கொத்தின் (Cluster) செயல்திறனை மேம்படுத்துகிறது.
  மாற்றமுடியாதவை என்று குறிக்கப்பட்ட Secret-களை kubelet watch வைத்திருக்க வேண்டியதில்லை.

### Secret-ஐ மாற்றமுடியாததாக குறித்தல் (Marking a Secret as immutable) {#secret-immutable-create}

`immutable` புலத்தை `true` என்று அமைத்து மாற்றமுடியாத Secret உருவாக்கலாம். எடுத்துக்காட்டாக,

```yaml
apiVersion: v1
kind: Secret
metadata: ...
data: ...
immutable: true
```

ஏற்கனவே இருக்கும் மாற்றக்கூடிய (mutable) Secret-ஐயும் மாற்றமுடியாததாக மாற்றலாம்.

{{< note >}}
ஒரு Secret அல்லது ConfigMap மாற்றமுடியாதது என்று குறிக்கப்பட்டவுடன், இந்த மாற்றத்தை
திரும்பப் பெறவோ அல்லது `data` புலத்தின் உள்ளடக்கங்களை மாற்றவோ _சாத்தியமில்லை_.
Secret-ஐ நீக்கி மீண்டும் உருவாக்கலாம் மட்டுமே.
நீக்கப்பட்ட Secret-க்கான ஏற்ற புள்ளியை (mount point) தற்போதைய Pod-கள் பராமரிக்கின்றன -
இந்த Pod-களை மீண்டும் உருவாக்குமாறு பரிந்துரைக்கப்படுகிறது.
{{< /note >}}

## Secret-களுக்கான தகவல் பாதுகாப்பு (Information security for Secrets) {#information-security-for-secrets}

ConfigMap மற்றும் Secret ஒரே மாதிரி வேலை செய்தாலும், Kubernetes Secret பொருள்களுக்கு
சில கூடுதல் பாதுகாப்புகளை பயன்படுத்துகிறது.

Secret-கள் பெரும்பாலும் Kubernetes-க்குள் (எ.கா. service account டோக்கன்கள்) மற்றும்
வெளிப்புற கணினிகளுக்கு அதிகரிப்புகளை (escalations) ஏற்படுத்தக்கூடிய முக்கியத்துவம்
நிறைந்த மதிப்புகளை கொண்டிருக்கின்றன. தனிப்பட்ட ஒரு பயன்பாடு தொடர்புகொள்ள எதிர்பார்க்கும்
Secret-களின் சக்தியை பற்றி தர்க்கிக்க முடிந்தாலும், அதே பெயரிடல் வெளியில் (Namespace)
உள்ள மற்ற பயன்பாடுகள் அந்த அனுமானங்களை செல்லாமல் ஆக்கலாம்.

அங்கீகரிப்பு உள்ளமைவு (Authorization configuration) ஒரு பெயரிடல் வெளியில் (Namespace) Secret
தரவை எவ்வாறு அணுகலாம் என்பதை பாதிக்கிறது. எடுத்துக்காட்டாக, Secret-களில் **list** அல்லது
**watch** அனுமதிகளை வழங்குவது ஒரு subject-க்கு அந்த பெயரிடல் வெளியில் உள்ள அனைத்து
Secret தரவையும் படிக்க அனுமதிக்கிறது, Pod-களால் வெளிப்படையாக குறிப்பிடப்பட்ட
Secret-களை மட்டும் அல்ல. பணிச்சுமை செயல்பட தேவையான குறைந்தபட்ச அனுமதி தொகுப்பிற்கு
அணுகலை கட்டுப்படுத்தவும், நிர்வாக நோக்கங்களுக்கு தேவையில்லாத வரை `cluster-admin` போன்ற
பரந்த பாத்திரங்களை (roles) வழங்குவதை தவிர்க்கவும்.

[அங்கீகரிப்பு ஆவணமும்](/docs/reference/access-authn-authz/rbac/) பார்க்கவும்.

ஒரு Secret ஒரு கணுவில் (node) உள்ள Pod-க்கு தேவைப்பட்டால் மட்டுமே அந்த கணுவிற்கு
அனுப்பப்படுகிறது.
Secret-களை Pod-களில் ஏற்றுவதற்கு (mounting), kubelet இரகசியத் தரவை `tmpfs`-இல்
சேமிக்கிறது, இதனால் நிலையான சேமிப்பகத்தில் (durable storage) இரகசியத் தரவு எழுதப்படாது.
Secret-ஐ சார்ந்த Pod நீக்கப்பட்டவுடன், kubelet Secret-ஐலிருந்து இரகசியத் தரவின்
உள்ளூர் நகலை (local copy) நீக்குகிறது.

ஒரு Pod-இல் பல கொள்கலன்கள் (Containers) இருக்கலாம். இயல்பாக, வரையறுக்கும் கொள்கலன்களுக்கு
இயல்புநிலை ServiceAccount மற்றும் அதனுடன் தொடர்புடைய Secret மட்டுமே அணுகல் கிடைக்கும்.
வேறு Secret-களுக்கு அணுகல் வழங்க, கொள்கலனில் (Container) சுற்றுச்சூழல் மாறிகளை வெளிப்படையாக
வரையறுக்க வேண்டும் அல்லது ஒரு தொகுதியை (Volume) வரைபடமாக்க (map) வேண்டும்.

அதே கணுவில் (node) பல Pod-களுக்கான Secret-கள் இருக்கலாம். இருப்பினும், ஒரு Pod கோரும்
Secret-கள் மட்டுமே அதன் கொள்கலன்களுக்கு (Containers) தெரியும். எனவே, ஒரு Pod மற்றொரு
Pod-இன் Secret-களை அணுக முடியாது.

### Secret-களுக்கு குறைந்த-சலுகை அணுகலை உள்ளமைத்தல் (Configure least-privilege access to Secrets) {#configure-least-privilege-access-to-secrets}

ஏற்றப்பட்ட Secret-களுக்கான அணுகலை தனிமைப்படுத்த தனி பெயரிடல் வெளிகளை (Namespaces)
பயன்படுத்தி Secret-களைச் சுற்றியுள்ள பாதுகாப்பு நடவடிக்கைகளை மேம்படுத்துங்கள்.

{{< warning >}}
ஒரு கணுவில் (node) `privileged: true` உடன் இயங்கும் எந்த கொள்கலனும் (Container)
அந்த கணுவில் பயன்படுத்தப்படும் அனைத்து Secret-களையும் அணுகலாம்.
{{< /warning >}}

## {{% heading "whatsnext" %}}

- உங்கள் Secret-களை நிர்வகிக்கவும் பாதுகாப்பை மேம்படுத்தவும் வழிகாட்டுதல்களுக்கு,
  [Kubernetes Secret-களுக்கான சிறந்த நடைமுறைகள்](/docs/concepts/security/secrets-good-practices) பார்க்கவும்.
- [`kubectl` மூலம் Secret-களை நிர்வகிப்பது எப்படி](/docs/tasks/configmap-secret/managing-secret-using-kubectl/) அறியவும்.
- [உள்ளமைவு கோப்பு மூலம் Secret-களை நிர்வகிப்பது எப்படி](/docs/tasks/configmap-secret/managing-secret-using-config-file/) அறியவும்.
- [kustomize மூலம் Secret-களை நிர்வகிப்பது எப்படி](/docs/tasks/configmap-secret/managing-secret-using-kustomize/) அறியவும்.
- `Secret`-க்கான [API குறிப்பு](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) படிக்கவும்.
