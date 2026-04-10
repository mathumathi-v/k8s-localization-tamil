---
reviewers:
- thockin
- caseydavenport
- danwinship
title: நெட்வொர்க் கொள்கைகள் (Network Policies)
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "NetworkPolicy"
description: >-
  IP முகவரி அல்லது port நிலையில் Pod-களுக்கு இடையேயான போக்குவரத்தை எவ்வாறு கட்டுப்படுத்துவது என்பதை NetworkPolicy-ஐ பயன்படுத்தி குறிப்பிடலாம்.
content_type: concept
weight: 70
---

<!-- overview -->

நெட்வொர்க் கொள்கை (NetworkPolicy) என்பது Pod-களுக்கிடையேயான மற்றும் Pod-களுக்கும் வெளிப்புற நெட்வொர்க் முனைப்புள்ளிகளுக்கும் இடையேயான போக்குவரத்தை IP முகவரி அல்லது port நிலையில் (OSI அடுக்கு 3 அல்லது 4) எவ்வாறு அனுமதிக்க வேண்டும் என்பதைக் குறிப்பிடும் ஒரு விவரக்குறிப்பு ஆகும்.

NetworkPolicy-கள் பயன்பாட்டை மையமாகக் கொண்டவை (application-centric). நீங்கள் {{< glossary_tooltip text="Pod" term_id="pod">}}-கள் எவ்வாறு பிற Pod-களுடனும் நெட்வொர்க்கின் வேறு முனைப்புள்ளிகளுடனும் தொடர்பு கொள்ள அனுமதிக்கப்பட்டுள்ளன என்பதை குறிப்பிடலாம்.

NetworkPolicy-கள் Pod-களுக்கு பொருந்தும், ஆனால் {{< glossary_tooltip text="Service" term_id="service">}}-களுக்கு அல்ல. Service-க்கு NetworkPolicy பொருந்தும் போது, அந்த Service-க்கு குறிவைக்கப்பட்ட Pod-களுக்கே அந்த கொள்கை பொருந்துகிறது, Service பொருளுக்கு நேரடியாக அல்ல.

நெட்வொர்க் கொள்கைகளைப் பயன்படுத்த {{< glossary_tooltip text="நெட்வொர்க் சொருகி (network plugin)" term_id="network-plugin">}} NetworkPolicy-களை ஆதரிக்க வேண்டும். NetworkPolicy-ஐ செயல்படுத்தும் controller இல்லாமல் ஒரு NetworkPolicy வளத்தை (resource) உருவாக்குவது எந்த விளைவையும் தராது.

<!-- body -->

## முன்நிபந்தனைகள் (Prerequisites)

நெட்வொர்க் கொள்கைகள் {{< glossary_tooltip text="நெட்வொர்க் சொருகி" term_id="network-plugin">}}-ஆல் செயல்படுத்தப்படுகின்றன. NetworkPolicy-களைப் பயன்படுத்த, NetworkPolicy-ஐ ஆதரிக்கும் ஒரு நெட்வொர்க் தீர்வை நீங்கள் பயன்படுத்த வேண்டும். இந்த NetworkPolicy வளத்தை செயல்படுத்தும் ஒரு controller இல்லாமல் உருவாக்குவது எந்த விளைவையும் ஏற்படுத்தாது.

## Pod தனிமைப்படுத்தலின் இரண்டு வகைகள் (The two sorts of pod isolation)

Pod-களில் இரண்டு வகையான தனிமைப்படுத்தல் (isolation) உள்ளன: வெளிசெல்லும் போக்குவரத்துக்கான (Egress) தனிமைப்படுத்தல் மற்றும் உள்வரும் போக்குவரத்துக்கான (Ingress) தனிமைப்படுத்தல். இவை தனிமைப்படுத்தலின் இரண்டு வெவ்வேறு திசைகளை குறிக்கின்றன, மேலும் இரண்டும் ஒரே நேரத்தில் ஒரு Pod-க்கு பொருந்தலாம்.

இயல்புநிலையில் (by default), ஒரு Pod தனிமைப்படுத்தப்படவில்லை; அது எல்லா மூலங்களிலிருந்தும் போக்குவரத்தை ஏற்கும்.

Egress (வெளிசெல்லும் போக்குவரத்துக்கான) தனிமைப்படுத்தல்: ஒரு Pod-க்கு பொருந்தும் எந்த NetworkPolicy-லும் `policyTypes` பட்டியலில் `Egress` இருந்தால் அந்த Pod Egress-க்காக தனிமைப்படுத்தப்பட்டதாகக் கருதப்படுகிறது. அந்த Pod-லிருந்து வெளிசெல்லும் போக்குவரத்துக்கான இணைப்பு, பொருந்தும் NetworkPolicy-ஒன்றின் `egress` பட்டியலில் உள்ள இலக்குடன் பொருந்த வேண்டும். `egress` பட்டியல்களின் அர்த்தம்:
- இலக்கு Pod (பெயரிடல் வெளி (Namespace) வழியாக அல்லது label வழியாக தேர்ந்தெடுக்கப்பட்டது)
- இலக்கு IP தொகுதி (block)

Ingress (உள்வரும் போக்குவரத்துக்கான) தனிமைப்படுத்தல்: ஒரு Pod-க்கு பொருந்தும் எந்த NetworkPolicy-லும் `policyTypes` பட்டியலில் `Ingress` இருந்தால் அந்த Pod Ingress-க்காக தனிமைப்படுத்தப்பட்டதாகக் கருதப்படுகிறது. அந்த Pod-க்கு உள்வரும் போக்குவரத்துக்கான இணைப்பு, பொருந்தும் NetworkPolicy-ஒன்றின் `ingress` பட்டியலில் உள்ள மூலத்துடன் பொருந்த வேண்டும். `ingress` பட்டியல்களின் அர்த்தம்:
- மூல Pod (பெயரிடல் வெளி வழியாக அல்லது label வழியாக தேர்ந்தெடுக்கப்பட்டது)
- மூல IP தொகுதி

நெட்வொர்க் கொள்கைகள் மோதலில்லாதவை (non-conflicting); அவை தொகுக்கக்கூடியவை (additive). ஒரு Pod ஒன்று அல்லது அதிகமான NetworkPolicy-களால் தேர்ந்தெடுக்கப்பட்டால், அனைத்து பொருந்தும் NetworkPolicy-களின் Ingress/Egress விதிகளின் தொகுப்பால் அனுமதிக்கப்பட்ட போக்குவரத்து தீர்மானிக்கப்படுகிறது. ஆக, மதிப்பீட்டு வரிசை முடிவை பாதிக்காது.

ஒரு Pod-லிருந்து மற்றொரு Pod-க்கான இணைப்பு அனுமதிக்கப்பட, மூல Pod-இல் உள்ள Egress கொள்கையும் இலக்கு Pod-இல் உள்ள Ingress கொள்கையும் இந்த இணைப்பை அனுமதிக்க வேண்டும்.

## NetworkPolicy வளம் (NetworkPolicy resource) {#networkpolicy-resource}

NetworkPolicy என்னவென்பதை புரிந்துக்கொள்ள ஒரு எடுத்துக்காட்டு NetworkPolicy வளத்தைப் பாருங்கள்:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978
```

{{< note >}}
`kubectl` மூலம் இந்த கொள்கையை `default` namespace-க்கு POST செய்தால் தவிர, கொத்தில் (cluster) இந்த கொள்கை எந்த விளைவையும் ஏற்படுத்தாது. நீங்கள் NetworkPolicy-ஐ ஆதரிக்கும் நெட்வொர்க்கைப் பயன்படுத்துகிறீர்கள் என்பதை உறுதிசெய்யுங்கள்.
{{< /note >}}

**கட்டாய புலங்கள் (Mandatory Fields):** NetworkPolicy-களுக்கு மற்ற எல்லா Kubernetes கட்டமைப்புகளைப் போலவே `apiVersion`, `kind`, மற்றும் `metadata` புலங்கள் தேவை.

**spec:** NetworkPolicy `spec`-ல் ஒரு குறிப்பிட்ட namespace-ல் நெட்வொர்க் கொள்கைகளை வரையறுக்கத் தேவையான அனைத்து தகவல்களும் உள்ளன.

**podSelector:** ஒவ்வொரு NetworkPolicy-லும் கொள்கை பொருந்தும் Pod-களின் குழுவைத் தேர்ந்தெடுக்கும் ஒரு `podSelector` அடங்கியிருக்கும். மேலுள்ள எடுத்துக்காட்டில் உள்ள கொள்கை `role=db` முத்திரையுடன் (label) கூடிய Pod-களைத் தேர்ந்தெடுக்கிறது. காலி `podSelector` namespace-ல் உள்ள எல்லா Pod-களையும் தேர்ந்தெடுக்கும்.

**policyTypes:** ஒவ்வொரு NetworkPolicy-லும் `Ingress`, `Egress` அல்லது இரண்டையும் கொண்ட ஒரு `policyTypes` பட்டியல் இருக்கலாம். `policyTypes` புலம், `podSelector`-ஆல் தேர்ந்தெடுக்கப்பட்ட Pod-களுக்கு கொடுக்கப்பட்ட கொள்கை `Ingress` போக்குவரத்தை அல்லது `Egress` போக்குவரத்தை அல்லது இரண்டையும் பாதிக்கிறதா என்பதைக் குறிக்கிறது. `policyTypes` குறிப்பிடப்படாவிட்டால், `Ingress` எப்போதும் அமைக்கப்படும், மேலும் NetworkPolicy-ல் Egress விதிகள் இருந்தால் `Egress`-ம் அமைக்கப்படும்.

**ingress:** ஒவ்வொரு NetworkPolicy-லும் அனுமதிக்கப்பட்ட `ingress` விதிகளின் பட்டியல் இருக்கலாம். ஒவ்வொரு விதியும் `from` மற்றும் `ports` பிரிவுகளை அனுமதிக்கிறது. மேலுள்ள எடுத்துக்காட்டில், மூன்று மூலங்களிலிருந்து ஒரு port-க்கான போக்குவரத்தை அனுமதிக்கும் ஒரே ஒரு ingress விதி உள்ளது. முதல் மூலம் `ipBlock` வழியாக குறிப்பிடப்பட்டுள்ளது, இரண்டாவது `namespaceSelector` வழியாக, மூன்றாவது `podSelector` வழியாக குறிப்பிடப்பட்டுள்ளது.

**egress:** ஒவ்வொரு NetworkPolicy-லும் அனுமதிக்கப்பட்ட `egress` விதிகளின் பட்டியல் இருக்கலாம். ஒவ்வொரு விதியும் `to` மற்றும் `ports` பிரிவுகளை அனுமதிக்கிறது. மேலுள்ள எடுத்துக்காட்டில், ஒரு குறிப்பிட்ட port-க்கு `10.0.0.0/24`-ல் உள்ள எந்த இலக்கிற்கும் போக்குவரத்தை அனுமதிக்கும் ஒரே ஒரு egress விதி உள்ளது.

எனவே, மேலுள்ள NetworkPolicy எடுத்துக்காட்டு:

1. `default` namespace-ல் உள்ள `role=db` Pod-களை Ingress மற்றும் Egress இரண்டிற்கும் தனிமைப்படுத்துகிறது (அவை ஏற்கனவே தனிமைப்படுத்தப்படவில்லை என்றால்).

2. (Ingress விதிகள்) `role=db` முத்திரையுடைய `default` namespace-ல் உள்ள Pod-களுக்கு TCP port 6379-க்கான இணைப்பை இவற்றிலிருந்து அனுமதிக்கிறது:
   - `172.17.0.0/16` முகவரி வரம்பில் உள்ள எந்த Pod அல்லது Node-லிருந்தும், ஆனால் `172.17.1.0/24` தவிர்த்து
   - `project=myproject` முத்திரையுடைய எந்த namespace-ல் உள்ள எந்த Pod-லிருந்தும்
   - `default` namespace-ல் `role=frontend` முத்திரையுடைய எந்த Pod-லிருந்தும்

3. (Egress விதிகள்) `role=db` முத்திரையுடைய `default` namespace-ல் உள்ள Pod-களிலிருந்து `10.0.0.0/24` முகவரி வரம்பில் TCP port 5978-க்கான இணைப்பை அனுமதிக்கிறது.

## `to` மற்றும் `from` தேர்வாளர்களின் நடத்தை (Behavior of `to` and `from` selectors)

`ingress` `from` பிரிவுகளிலோ அல்லது `egress` `to` பிரிவுகளிலோ குறிப்பிடக்கூடிய நான்கு வகையான தேர்வாளர்கள் (selectors) உள்ளன:

**podSelector:** இது `namespaceSelector`-ஐ காணக்கூடிய அதே namespace-ல் இருந்து குறிப்பிட்ட Pod-களைத் தேர்ந்தெடுக்கிறது, அவை ingress மூலங்கள் அல்லது egress இலக்குகளாக அனுமதிக்கப்பட வேண்டும்.

**namespaceSelector:** இது குறிப்பிட்ட namespace-களைத் தேர்ந்தெடுக்கிறது, அதனுள் உள்ள அனைத்து Pod-களும் ingress மூலங்கள் அல்லது egress இலக்குகளாக அனுமதிக்கப்பட வேண்டும்.

**namespaceSelector மற்றும் podSelector:** ஒரே `from`/`to` உள்ளீட்டில் `namespaceSelector` மற்றும் `podSelector` இரண்டையும் குறிப்பிடும் ஒரு `from`/`to` உள்ளீடு, குறிப்பிட்ட namespace-ல் உள்ள குறிப்பிட்ட Pod-களைத் தேர்ந்தெடுக்கிறது. YAML-ஐ சரியாக எழுதுவதில் கவனமாக இருங்கள்; இந்த கொள்கை:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

ஒரு `from` உள்ளீட்டை `namespaceSelector` _மற்றும்_ `podSelector` இரண்டையும் கொண்டு குறிப்பிட்டுள்ளது, இது `user=alice` என்று முத்திரையிடப்பட்ட namespace-ல் `role=client` என்று முத்திரையிடப்பட்ட Pod-களிலிருந்து போக்குவரத்தை அனுமதிக்கிறது. ஆனால் _இந்த_ கொள்கை:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

`from` அரேயில் இரண்டு தனித்தனி உள்ளீடுகளை குறிப்பிடுகிறது, இது `user=alice` என்று முத்திரையிடப்பட்ட _எந்த_ namespace-லிருந்தும் Pod-களிலிருந்தும் அல்லது _எந்த_ namespace-லும் `role=client` என்று முத்திரையிடப்பட்ட Pod-களிலிருந்தும் போக்குவரத்தை அனுமதிக்கிறது.

சந்தேகம் ஏற்பட்டால், NetworkPolicy-ஐ தற்போது ஆதரிக்கப்படும் நிலைக்கு பகுப்பாய்வு செய்ய `kubectl describe`-ஐ பயன்படுத்துங்கள்.

**ipBlock:** இது குறிப்பிட்ட IP CIDR வரம்புகளை ingress மூலங்கள் அல்லது egress இலக்குகளாக தேர்ந்தெடுக்கிறது. இவை கொத்துக்கு வெளிப்புறமான IP-கள் ஆக இருக்க வேண்டும், ஏனெனில் Pod IP-கள் நிலையற்றவை மற்றும் கணிக்க முடியாதவை.

கொத்து ingress மற்றும் egress வழிமுறைகள் பெரும்பாலும் Pod-களின் மூல அல்லது இலக்கு IP-களை மாற்றியமைப்பை (rewriting) தேவைப்படுகின்றன. இது நடக்கும் போது, NetworkPolicy அந்த மாற்றங்கள் முன்னர் செயலாக்கப்பட்டதா பின்னர் செயலாக்கப்பட்டதா என்பது வரையறுக்கப்படவில்லை மற்றும் வெவ்வேறு network plugin-கள், cloud provider-கள், `Service` செயல்பாடுகள் மற்றும் பிற வழக்குகளுக்கு இது மாறுபடலாம்.

Ingress விஷயத்தில், சில சந்தர்ப்பங்களில் நீங்கள் மூல IP-ஐ வடிகட்ட பிண்ணிணைப்பு (actual) packet மூல IP-ஐ அல்லது இலக்கு node IP-ஐ அல்லது வேறு ஏதாவதை பார்க்கலாம்; Egress விஷயத்தில், Pod IP-லிருந்து Service IP-க்கு போக்குவரத்தை Service VIP அல்லது egress node IP-க்கு மாற்றலாம்.

## இயல்புநிலை கொள்கைகள் (Default policies)

இயல்புநிலையில், ஒரு namespace-ல் எந்த NetworkPolicy-களும் இல்லாவிட்டால், அந்த namespace-ல் உள்ள Pod-களில் எல்லா ingress மற்றும் egress போக்குவரத்தும் அனுமதிக்கப்படுகிறது. பின்வரும் எடுத்துக்காட்டுகள் அந்த namespace-ல் இயல்புநிலை நடத்தையை மாற்ற உங்களை அனுமதிக்கின்றன.

### இயல்புநிலை அனைத்து ingress-ஐயும் மறுத்தல் (Default deny all ingress traffic)

குறிப்பிட்ட namespace-க்கான "default" தனிமைப்படுத்தல் கொள்கையை அந்த namespace-ல் உள்ள அனைத்து Pod-களையும் தேர்ந்தெடுக்கும் ஆனால் அந்த Pod-களில் எந்த ingress போக்குவரத்தையும் அனுமதிக்காத NetworkPolicy உருவாக்குவதன் மூலம் உருவாக்கலாம்:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

இது namespace-ல் உள்ள எந்த Pod-க்கும் அவர்கள் தேர்ந்தெடுக்கப்படாத வேறு எந்த NetworkPolicy-யாலும் ingress போக்குவரத்தை அனுமதிக்காமல் இருக்கச் செய்கிறது. இந்த கொள்கை எந்த pod-க்கான egress போக்குவரத்தையும் மாற்றாது.

### இயல்புநிலை அனைத்து ingress மற்றும் egress போக்குவரத்தையும் அனுமதித்தல் (Default allow all ingress traffic)

ஒரு namespace-ல் உள்ள அனைத்து Pod-களுக்கும் அனைத்து ingress போக்குவரத்தையும் அனுமதிக்க விரும்பினால் (ஒரு NetworkPolicy-ஆல் சேர்க்கப்பட்ட Pod-களில் கூட), அந்த namespace-ல் உள்ள அனைத்து Pod-களுக்கும் அனைத்து ingress போக்குவரத்தையும் அனுமதிக்கும் ஒரு கொள்கையை உருவாக்கலாம்:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-ingress
spec:
  podSelector: {}
  ingress:
  - {}
  policyTypes:
  - Ingress
```

இந்த கொள்கை இருக்கும் போது, எந்த கூடுதல் கொள்கைகளும் எந்த Pod-க்கும் ingress-ஐ மறுக்காது. இந்த கொள்கை எந்த pod-க்கான egress போக்குவரத்தையும் பாதிக்காது.

### இயல்புநிலை அனைத்து egress-ஐயும் மறுத்தல் (Default deny all egress traffic)

குறிப்பிட்ட namespace-க்கான "default" egress தனிமைப்படுத்தல் கொள்கையை அந்த namespace-ல் உள்ள அனைத்து Pod-களையும் தேர்ந்தெடுக்கும் ஆனால் அந்த Pod-களில் எந்த egress போக்குவரத்தையும் அனுமதிக்காத NetworkPolicy உருவாக்குவதன் மூலம் உருவாக்கலாம்:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

இது namespace-ல் உள்ள எந்த Pod-க்கும் அவர்கள் தேர்ந்தெடுக்கப்படாத வேறு எந்த NetworkPolicy-யாலும் egress போக்குவரத்தை அனுமதிக்காமல் இருக்கச் செய்கிறது. இந்த கொள்கை எந்த Pod-க்கான ingress போக்குவரத்தையும் மாற்றாது.

### இயல்புநிலை அனைத்து egress போக்குவரத்தையும் அனுமதித்தல் (Default allow all egress traffic)

ஒரு namespace-ல் உள்ள அனைத்து Pod-களிலிருந்தும் அனைத்து egress போக்குவரத்தையும் அனுமதிக்க விரும்பினால் (ஒரு NetworkPolicy-ஆல் சேர்க்கப்பட்ட Pod-களில் கூட), அந்த namespace-ல் உள்ள அனைத்து Pod-களிலிருந்தும் அனைத்து egress போக்குவரத்தையும் அனுமதிக்கும் ஒரு கொள்கையை உருவாக்கலாம்:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-egress
spec:
  podSelector: {}
  egress:
  - {}
  policyTypes:
  - Egress
```

இந்த கொள்கை இருக்கும் போது, எந்த கூடுதல் கொள்கைகளும் எந்த Pod-க்கும் egress-ஐ மறுக்காது. இந்த கொள்கை எந்த Pod-க்கான ingress போக்குவரத்தையும் பாதிக்காது.

### இயல்புநிலை அனைத்து ingress மற்றும் egress போக்குவரத்தையும் மறுத்தல் (Default deny all ingress and all egress traffic)

ஒரு namespace-ல் இயல்புநிலை கொள்கையை உருவாக்கலாம், இது அந்த namespace-ல் உள்ள அனைத்து ingress மற்றும் egress போக்குவரத்தையும் தடுக்கும்:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

இது namespace-ல் உள்ள எந்த Pod-க்கும் அவர்கள் தேர்ந்தெடுக்கப்படாத வேறு எந்த NetworkPolicy-யாலும் ingress அல்லது egress போக்குவரத்தை அனுமதிக்காமல் இருக்கச் செய்கிறது.

## SCTP ஆதரவு (SCTP support)

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

SCTP போக்குவரத்தை NetworkPolicy-களில் பயன்படுத்த முடியும், TCP மற்றும் UDP-ஐப் போலவே. ஆனால் SCTP-ஐப் பயன்படுத்த network plugin SCTP ஆதரவை வழங்க வேண்டும். SCTP ஆதரவு இல்லாத network plugin-ஐ பயன்படுத்தும் போது, SCTP-ஐப் பயன்படுத்த முயற்சிக்கும் NetworkPolicy விதிகளை API server ஏற்கலாம், ஆனால் அவை செயல்படுத்தப்படுவதில்லை.

## Port வரம்பை குறிவைத்தல் (Targeting a range of ports)

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

NetworkPolicy-க்கான `ports` பட்டியலை எழுதும் போது, ஒரு port-க்கு பதிலாக port வரம்பை குறிவைக்கலாம். `endPort` புலத்தைப் பயன்படுத்தி இதைச் செய்யலாம், பின்வரும் எடுத்துக்காட்டில் காட்டப்பட்டுள்ளது:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: multi-port-egress
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 32000
      endPort: 32768
```

மேலுள்ள விதி `10.0.0.0/24` CIDR-ல் உள்ள எந்த TCP port-லிலும் 32000 முதல் 32768 வரை `default` namespace-ல் `role=db` முத்திரையுடைய எந்த Pod-லிருந்தும் போக்குவரத்தை அனுமதிக்கிறது.

இந்த புலத்தைப் பயன்படுத்தும் போது பின்வரும் கட்டுப்பாடுகள் பொருந்தும்:

- `endPort` புலத்தின் மதிப்பு `port` புலத்தின் மதிப்பை விட அதிகமாகவோ சமம்மாகவோ இருக்க வேண்டும்.
- `endPort`-ஐ தொடர்புடைய `port` இல்லாமல் வரையறுக்க முடியாது.
- இரண்டு ports-ம் எண்களாக இருக்க வேண்டும். `endPort` named port-களுக்கு வேலை செய்யாது.

port வரம்புகள் ஆதரவு இல்லாத network plugin-ஐ பயன்படுத்தும் போது, API server ஒரு NetworkPolicy-ல் `endPort` புலத்தை ஏற்கலாம், ஆனால் network plugin அதன்படி நெட்வொர்க் போக்குவரத்தை வடிகட்டாது.

## label-ஆல் பல Namespace-களை குறிவைத்தல் (Targeting multiple namespaces by label)

ஒரு குறிப்பிட்ட label-ஐக் கொண்ட ஒன்றுக்கு மேற்பட்ட namespace-களை குறிவைக்கும் போது, தேர்ந்தெடுக்கப்பட்ட எல்லா namespace-களிலிருந்தும் போக்குவரத்தை அனுமதிக்க (அல்லது தடுக்க) `namespaceSelector` பயன்படுத்தலாம். எடுத்துக்காட்டாக:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-namespaces
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Egress
  egress:
  - ports:
    - port: 5978
      protocol: TCP
    to:
    - namespaceSelector:
        matchExpressions:
        - key: namespace
          operator: In
          values:
          - testing
          - staging
```

{{< note >}}
ஒரு நேரத்தில் இரண்டுக்கும் மேற்பட்ட namespace-களை label-ஆல் குறிவைக்க `namespaceSelector`-ல் `matchExpressions`-ஐ பயன்படுத்துவது சாத்தியம். ஆனால் `matchLabels`-ஐ பயன்படுத்தும் போது ஒரே ஒரு namespace-ஐ மட்டுமே குறிவைக்க முடியும்.
{{< /note >}}

## பெயரால் Namespace-ஐ குறிவைத்தல் (Targeting a Namespace by its name)

Kubernetes control plane, `kubernetes.io/metadata.name` என்ற label-ஐ எல்லா namespace-களிலும் அந்த namespace-இன் பெயருக்கு சமம்மான மதிப்புடன் அமைக்கிறது, Namespace-இன் பெயரால் குறிவைக்க:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-to-specific-namespace
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: my-namespace
```

மேலுள்ள NetworkPolicy `default` namespace-ல் `app=myapp` முத்திரையுடைய Pod-களிலிருந்து `my-namespace` என்ற பெயர் கொண்ட namespace-க்கு egress போக்குவரத்தை அனுமதிக்கிறது.

## Pod வாழ்க்கை சுழற்சி (Pod lifecycle)

Pod-கள் கொத்தில் அமைக்கப்பட்ட, இயங்கும் மற்றும் நிறுத்தப்படும்போது NetworkPolicy-கள் எவ்வாறு பொருந்துகின்றன என்பது குறித்து கவனமாக சிந்திக்க வேண்டும். குறிப்பாக:

ஒரு NetworkPolicy-ல் `podSelector`-ஐ குறிப்பிடும் போது, தேர்வாளர் (selector) ஒரு குறிப்பிட்ட Pod-க்கு பொருந்துமா என்பதை கொள்கை பொருந்தும் நேரத்தில் மதிப்பிடப்படுகிறது. ஒரு Pod-இன் labels மாறினால், Pod-க்கு பொருந்தும் NetworkPolicy-கள் மாறலாம்.

ஒரு Pod கொத்தில் அமைக்கப்படும் போது, அது IP முகவரியைப் பெறுவதற்கு முன்பே NetworkPolicy-கள் அந்த Pod-க்குப் பொருந்தலாம். இதன் பொருள் ஒரு Pod தொடங்கும் முன்பே அதற்கான நெட்வொர்க் தனிமைப்படுத்தல் செயல்படுத்தப்படலாம்.

ஒரு Pod நிறுத்தப்படும் போது, அது நிறுத்தப்பட்ட நேரத்தில் பொருந்தும் NetworkPolicy-கள் செயல்படுத்தப்படும். Pod-இன் நெட்வொர்க் இடைமுகம் சுத்தம் செய்யப்படுவதற்கு முன்பு Pod-க்கான இணைப்புகள் நேர் அல்லது திடீரென முடிக்கப்படலாம்.

## நெட்வொர்க் கொள்கைகள் மூலம் என்ன செய்ய முடியாது (What you can't do with network policies (at least, not yet))

Kubernetes 1.33 நிலவரப்படி, NetworkPolicy API-ல் பின்வரும் செயல்பாடுகள் இல்லை, ஆனால் operating system கூறுகள் (SELinux, OpenVSwitch, IPTables போன்றவற்றை) பயன்படுத்தி அல்லது Layer 7 தொழில்நுட்பங்கள் (Ingress controllers, service mesh செயல்பாடுகள்) அல்லது Admission controllers மூலம் சில தீர்வுகளை அடைய முடியும்:

- **கொத்துக்குள் உள்ள அனைத்து போக்குவரத்தையும் கட்டாயப்படுத்தல்:** TLS போன்ற identity-based-ஐ கட்டாயமாக்க NetworkPolicy ஐ பயன்படுத்த முடியாது.

- **Node-குறிப்பிட்ட கொள்கைகள்:** NetworkPolicy Node-களுக்கு பொருந்தாது, Pod-களுக்கு மட்டுமே பொருந்தும்.

- **பெயரால் Service-களை குறிவைத்தல்:** NetworkPolicy விதிகளில் Kubernetes Service-களை பெயரால் குறிப்பிட முடியாது. Label selectors மற்றும் IP blocks மட்டுமே ஆதரிக்கப்படுகின்றன.

- **வெளிப்படையான "deny" விதிகளை உருவாக்குதல்:** NetworkPolicy-கள் அனுமதி அடிப்படையிலானவை (allow-only); வெளிப்படையான மறுத்தல் (explicit deny) விதிகளை உருவாக்க முடியாது.

- **Layer 7 வடிகட்டல்:** NetworkPolicy Layer 3/4 நிலையில் மட்டுமே செயல்படுகிறது. HTTP request பாதைகள் அல்லது headers போன்ற Layer 7 வடிகட்டல் ஆதரிக்கப்படவில்லை.

- **TLS கட்டாயமாக்குதல்:** NetworkPolicy TLS சான்றிதழ்களை சரிபார்க்காது.

- **இணைப்பு பதிவு செய்தல் (Connection logging):** NetworkPolicy Network flows-ஐ பதிவு செய்யாது.

- **Namespace கொள்கைகளை குறிப்பிடுதல்:** ஒரே ஒரு NetworkPolicy ஒன்றிற்கும் மேற்பட்ட namespace-களுக்கு அல்லது cluster-அளவிலான (cluster-wide) கொள்கையை வரையறுக்க முடியாது. தனி namespace-களில் தனிப்படையான NetworkPolicy-களை உருவாக்க வேண்டும்.

- **Kubernetes-இல் குறிப்பிட்ட Pod-களை `host network`-ல் குறிவைத்தல்:** Pod `spec.hostNetwork: true`-உடன் host network-ஐப் பயன்படுத்தினால், அந்த Pod NetworkPolicy வடிகட்டலைத் தவிர்க்கலாம்.

- **ஊர்ந்திலா (non-standard) நெட்வொர்க் network plugin-களுக்கான ஆதரவு:** NetworkPolicy-ஐ ஆதரிக்காத network plugin-கள் NetworkPolicy விதிகளை புறக்கணிக்கும்.

## {{% heading "whatsnext" %}}

- [நெட்வொர்க் கொள்கைகள் மூலம் பயன்பாட்டை பாதுகாத்தல்](/docs/tasks/administer-cluster/declare-network-policy/) tutorial-ஐப் பாருங்கள்.
- NetworkPolicy வளத்தில் ஆதரிக்கப்படும் அனைத்து புலங்களையும் புரிந்துக்கொள்ள [NetworkPolicy](/docs/reference/kubernetes-api/policy-resources/network-policy-v1/) கோப்பை படிக்கவும்.
