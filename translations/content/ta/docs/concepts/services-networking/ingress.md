---
reviewers:
- robscott
- rikatz
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  HTTP (அல்லது HTTPS) நெட்வொர்க் சேவையை URI, ஹோஸ்ட்பெயர்கள், பாதைகள் போன்ற இணைய கருத்துகளை புரிந்துகொள்ளும் நெறிமுறை-விழிப்பு உள்ளமைவு வழிமுறை மூலம் கிடைக்கச் செய்யுங்கள். Ingress கருத்து, Kubernetes API வழியாக நீங்கள் வரையறுக்கும் விதிகளின் அடிப்படையில் போக்குவரத்தை வெவ்வேறு backend-களுக்கு வரைபடமிட அனுமதிக்கிறது.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
Kubernetes திட்டம் Ingress-க்கு பதிலாக [Gateway](https://gateway-api.sigs.k8s.io/) பயன்படுத்த பரிந்துரைக்கிறது.
Ingress API முடக்கப்பட்டுள்ளது.

இதன் பொருள்:
* Ingress API பொதுவாக கிடைக்கிறது, மேலும் பொதுவாக கிடைக்கும் API-களுக்கான [நிலைத்தன்மை உத்தரவாதங்களுக்கு](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) உட்பட்டது.
  Kubernetes திட்டம் Ingress-ஐ Kubernetes-இலிருந்து அகற்றும் திட்டம் எதுவும் இல்லை.
* Ingress API இனி மேம்படுத்தப்படவில்லை, மேலும் இதில் மேலும் எந்த மாற்றங்களும் புதுப்பிப்புகளும் செய்யப்படமாட்டா.
{{< /note >}}

<!-- body -->


## சொற்களஞ்சியம் (Terminology)

தெளிவுக்காக, இந்த வழிகாட்டி பின்வரும் சொற்களை வரையறுக்கிறது:

* Node: Kubernetes-இல் ஒரு பணி இயந்திரம் (worker machine), கொத்தின் (Cluster) ஒரு பகுதி.
* Cluster: Kubernetes ஆல் நிர்வகிக்கப்படும் கொள்கலனாக்கப்பட்ட (containerized) பயன்பாடுகளை இயக்கும் Node-களின் தொகுப்பு. இந்த எடுத்துக்காட்டில், மற்றும் பெரும்பாலான பொதுவான Kubernetes deployment-களில், கொத்தில் உள்ள Node-கள் பொது இணையத்தின் ஒரு பகுதி அல்ல.
* Edge router (விளிம்பு திசைவி): உங்கள் கொத்துக்கான firewall கொள்கையை அமல்படுத்தும் ஒரு router. இது ஒரு cloud வழங்குனரால் நிர்வகிக்கப்படும் gateway அல்லது ஒரு உடல் hardware சாதனமாக இருக்கலாம்.
* Cluster network (கொத்து வலையமைப்பு): Kubernetes [வலையமைப்பு மாதிரியின்](/docs/concepts/cluster-administration/networking/) படி ஒரு கொத்துக்குள் தொடர்பாடலை எளிதாக்கும் தொடர்புகளின் தொகுப்பு, தர்க்கரீதியான அல்லது உடல்.
* Service: {{< glossary_tooltip text="முத்திரை (label)" term_id="label" >}} தேர்வாளர்களை (Selectors) பயன்படுத்தி Pod-களின் தொகுப்பை அடையாளப்படுத்தும் ஒரு Kubernetes {{< glossary_tooltip term_id="service" >}}. வேறுவிதமாக குறிப்பிடப்படாவிட்டால், சேவைகள் (Services) கொத்து வலையமைப்பிற்குள் மட்டுமே திருப்பி விடக்கூடிய மெய்நிகர் IP-களை மட்டுமே கொண்டிருப்பதாகக் கருதப்படுகிறது.

## Ingress என்றால் என்ன? (What is Ingress?)

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
கொத்துக்கு (Cluster) வெளியிலிருந்து கொத்துக்குள் உள்ள
{{< link text="சேவைகளுக்கு (services)" url="/docs/concepts/services-networking/service/" >}} HTTP மற்றும் HTTPS பாதைகளை வெளிப்படுத்துகிறது.
போக்குவரத்து திசை நிர்ணயம் Ingress வளத்தில் வரையறுக்கப்பட்ட விதிகளால் கட்டுப்படுத்தப்படுகிறது.

இங்கே ஒரு எளிய எடுத்துக்காட்டு உள்ளது, இதில் Ingress அனைத்து போக்குவரத்தையும் ஒரு Service-க்கு அனுப்புகிறது:

{{< figure src="/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="Figure. Ingress" link="https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxcix-qmGwbuXA7DwAEzzQETXKutof0Ovb4vaoUQkwKUu6pi3FwXM_QSHGBt0VFFt8DRU2OWSGrKUUMlVQwMmhVLEV1Vcm9-aUksiuXRaO_CEhkv4WjBfAgG1TrGaLa-iaUw6a0DcwGI-WgOsF7zm-pN881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEpuNuRu_4rZ1pqQ7L5fL6YQPaPNiFuywcG9_-ihNyUkm6YSONWkjVNM8WUIyaeOJLO3clTB_KhL8NQDmVe-OJjxgZM5FhFiiFTK5zjDkxHBQ9_4zB4a-x20EGNSZhyaKmXrg7f5hSsvufUwTMXThtMWiot5Jh6p9ffimHijIezaSVoeN0uiqcfMJvf7w" >}}

ஒரு Ingress-ஐ சேவைகளுக்கு (Services) வெளியிலிருந்து அணுகக்கூடிய URL-களை வழங்க, போக்குவரத்தை சுமை பகிர்வு (load balance) செய்ய, SSL / TLS-ஐ முடிக்க, மற்றும் பெயர் அடிப்படையிலான மெய்நிகர் ஹோஸ்டிங் வழங்க உள்ளமைவு செய்யலாம். ஒரு [Ingress controller](/docs/concepts/services-networking/ingress-controllers) Ingress-ஐ நிறைவேற்றுவதற்கு பொறுப்பாகும், பொதுவாக ஒரு சுமை பகிர்வியுடன் (load balancer), இருப்பினும் இது போக்குவரத்தை கையாள உதவ உங்கள் edge router அல்லது கூடுதல் frontends-ஐயும் உள்ளமைவு செய்யலாம்.

ஒரு Ingress தன்னிச்சையான port-கள் அல்லது நெறிமுறைகளை வெளிப்படுத்தாது. HTTP மற்றும் HTTPS தவிர சேவைகளை இணையத்திற்கு வெளிப்படுத்துவதற்கு பொதுவாக [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) அல்லது [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) வகை சேவையைப் பயன்படுத்துகிறது.

## முன்நிபந்தனைகள் (Prerequisites)

ஒரு Ingress-ஐ நிறைவேற்ற நீங்கள் ஒரு [Ingress controller](/docs/concepts/services-networking/ingress-controllers) வைத்திருக்க வேண்டும். வெறும் ஒரு Ingress வளத்தை உருவாக்குவது எந்த விளைவையும் ஏற்படுத்தாது.

நீங்கள் பல [Ingress controllers](/docs/concepts/services-networking/ingress-controllers)-ல் இருந்து தேர்வு செய்யலாம்.

இல்லாமல், அனைத்து Ingress controllers-உம் குறிப்பு விவரக்கூற்றுக்கு பொருந்த வேண்டும். நடைமுறையில், வெவ்வேறு Ingress controllers சிறிது வித்தியாசமாக செயல்படுகின்றன.

{{< note >}}
நீங்கள் தேர்ந்தெடுப்பதன் எச்சரிக்கைகளை புரிந்துகொள்ள உங்கள் Ingress controller-இன் ஆவணத்தை மதிப்பாய்வு செய்ய உறுதி செய்யுங்கள்.
{{< /note >}}

## Ingress வளம் (The Ingress resource)

ஒரு குறைந்தபட்ச Ingress வள எடுத்துக்காட்டு:

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

ஒரு Ingress-க்கு `apiVersion`, `kind`, `metadata` மற்றும் `spec` புலங்கள் தேவை.
ஒரு Ingress பொருளின் பெயர் ஒரு செல்லுபடியாகும்
[DNS துணை டொமைன் பெயராக](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) இருக்க வேண்டும்.
config கோப்புகளுடன் பணிபுரிவது பற்றிய பொதுவான தகவலுக்கு,
[பயன்பாடுகளை நிலைநிறுத்துதல்](/docs/tasks/run-application/run-stateless-application-deployment/),
[கொள்கலன்களை உள்ளமைவு செய்தல்](/docs/tasks/configure-pod-container/configure-pod-configmap/),
[வளங்களை நிர்வகித்தல்](/docs/concepts/workloads/management/) ஆகியவற்றைப் பாருங்கள்.
Ingress controllers நடத்தையை உள்ளமைவு செய்ய அடிக்கடி [குறிப்புகளை (annotations)](/docs/concepts/overview/working-with-objects/annotations/) பயன்படுத்துகின்றன.
எந்த குறிப்புகள் எதிர்பார்க்கப்படுகின்றன மற்றும் / அல்லது ஆதரிக்கப்படுகின்றன என்பதை அறிய உங்கள் ingress controller தேர்வுக்கான ஆவணத்தை மதிப்பாய்வு செய்யுங்கள்.

[Ingress spec](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)-ல் ஒரு சுமை பகிர்வி (load balancer) அல்லது proxy சேவையகத்தை உள்ளமைவு செய்ய தேவையான அனைத்து தகவல்களும் உள்ளன. மிக முக்கியமாக, இது அனைத்து உள்வரும் கோரிக்கைகளுக்கு எதிராக பொருத்தப்படும் விதிகளின் பட்டியலை கொண்டுள்ளது. Ingress வளம் HTTP(S) போக்குவரத்தை நேரடியாக செலுத்துவதற்கான விதிகளை மட்டுமே ஆதரிக்கிறது.

`ingressClassName` தவிர்க்கப்பட்டால், ஒரு [இயல்புநிலை Ingress class](#default-ingress-class) வரையறுக்கப்பட்டிருக்க வேண்டும்.

சில ingress controllers இயல்புநிலை IngressClass வரையறை இல்லாமலும் வேலை செய்கின்றன. எந்த IngressClass இல்லாமல் செயல்படும் திறன் கொண்ட ingress controller-ஐ நீங்கள் பயன்படுத்தினாலும், Kubernetes திட்டம் இன்னும் நீங்கள் ஒரு இயல்புநிலை IngressClass-ஐ வரையறுக்க பரிந்துரைக்கிறது.

### Ingress விதிகள் (Ingress rules)

ஒவ்வொரு HTTP விதியும் பின்வரும் தகவல்களை கொண்டுள்ளது:

* ஒரு விருப்பமான host. இந்த எடுத்துக்காட்டில், எந்த host-உம் குறிப்பிடப்படவில்லை, எனவே விதி குறிப்பிட்ட IP முகவரி வழியாக வரும் அனைத்து உள்வரும் HTTP போக்குவரத்துக்கும் பொருந்துகிறது. ஒரு host வழங்கப்பட்டால் (எடுத்துக்காட்டாக, foo.bar.com), விதிகள் அந்த host-க்கு பொருந்தும்.
* பாதைகளின் (paths) பட்டியல் (எடுத்துக்காட்டாக, `/testpath`), ஒவ்வொன்றுக்கும் `service.name` மற்றும் `service.port.name` அல்லது `service.port.number`-உடன் வரையறுக்கப்பட்ட தொடர்புடைய backend உள்ளது. சுமை பகிர்வி குறிப்பிடப்பட்ட Service-க்கு போக்குவரத்தை நேரடியாக செலுத்துவதற்கு முன், host மற்றும் path இரண்டும் உள்வரும் கோரிக்கையின் உள்ளடக்கத்துடன் பொருந்த வேண்டும்.
* ஒரு backend என்பது [Service ஆவணத்தில்](/docs/concepts/services-networking/service/) விவரிக்கப்பட்டுள்ளபடி Service மற்றும் port பெயர்களின் கலவை அல்லது {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}} மூலம் ஒரு [தனிப்பயன் வள backend](#resource-backend). விதியின் host மற்றும் path-ஐ பொருத்தும் Ingress-க்கான HTTP (மற்றும் HTTPS) கோரிக்கைகள் பட்டியலிடப்பட்ட backend-க்கு அனுப்பப்படுகின்றன.

ஒரு `defaultBackend` பெரும்பாலும் spec-ல் உள்ள பாதையுடன் பொருந்தாத கோரிக்கைகளுக்கு சேவை செய்ய Ingress controller-ல் உள்ளமைவு செய்யப்படுகிறது.

### இயல்புநிலை Backend (DefaultBackend) {#default-backend}

விதிகள் இல்லாத ஒரு Ingress அனைத்து போக்குவரத்தையும் ஒரு இயல்புநிலை backend-க்கு அனுப்புகிறது, மேலும் `.spec.defaultBackend` என்பது அந்த வழக்கில் கோரிக்கைகளை கையாள வேண்டிய backend ஆகும்.
`defaultBackend` வழக்கமாக [Ingress controller](/docs/concepts/services-networking/ingress-controllers)-இன் ஒரு உள்ளமைவு விருப்பமாகும், மேலும் இது உங்கள் Ingress வளங்களில் குறிப்பிடப்படவில்லை.
`.spec.rules` குறிப்பிடப்படாவிட்டால், `.spec.defaultBackend` குறிப்பிடப்பட வேண்டும்.
`defaultBackend` அமைக்கப்படாவிட்டால், எந்த விதிகளுடனும் பொருந்தாத கோரிக்கைகளை கையாள்வது ingress controller-ஐ பொறுத்தது (இந்த வழக்கை அது எவ்வாறு கையாளுகிறது என்பதை கண்டுபிடிக்க உங்கள் ingress controller-இன் ஆவணத்தை பார்க்கவும்).

Ingress பொருள்களில் உள்ள HTTP கோரிக்கையுடன் எந்த hosts அல்லது paths-உம் பொருந்தவில்லை என்றால், போக்குவரத்து உங்கள் இயல்புநிலை backend-க்கு திருப்பி விடப்படுகிறது.

### வள backend-கள் (Resource backends) {#resource-backend}

ஒரு `Resource` backend என்பது Ingress பொருளின் அதே பெயரிடல் வெளியில் (Namespace) உள்ள மற்றொரு Kubernetes வளத்திற்கான ObjectRef ஆகும். ஒரு `Resource` என்பது Service-உடன் பரஸ்பர விலக்கு அமைப்பு ஆகும், மேலும் இரண்டும் குறிப்பிடப்பட்டால் சரிபார்ப்பு தோல்வியடையும். `Resource` backend-க்கான பொதுவான பயன்பாடு என்னவென்றால், நிலையான சொத்துகளுடன் ஒரு பொருள் சேமிப்பு backend-க்கு தரவை Ingress செய்வது.

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

மேலே உள்ள Ingress-ஐ உருவாக்கிய பிறகு, பின்வரும் கட்டளையுடன் அதை பார்க்கலாம்:

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### பாதை வகைகள் (Path types)

Ingress-ல் உள்ள ஒவ்வொரு பாதைக்கும் தொடர்புடைய பாதை வகை இருக்க வேண்டும். வெளிப்படையான `pathType` இல்லாத பாதைகள் சரிபார்ப்பில் தோல்வியடையும். மூன்று ஆதரிக்கப்படும் பாதை வகைகள் உள்ளன:

* `ImplementationSpecific`: இந்த பாதை வகையுடன், பொருத்துதல் IngressClass-ஐ பொறுத்தது. செயலாக்கங்கள் இதை ஒரு தனி `pathType` ஆக அல்லது `Prefix` அல்லது `Exact` பாதை வகைகளுடன் ஒரே மாதிரியாக நடத்தலாம்.

* `Exact`: URL பாதையை சரியாக மற்றும் எழுத்து உணர்வுடன் பொருத்துகிறது.

* `Prefix`: `/` ஆல் பிரிக்கப்பட்ட URL பாதை முன்னொட்டின் அடிப்படையில் பொருத்துகிறது. பொருத்துதல் எழுத்து உணர்வானது மற்றும் ஒரு பாதை உறுப்பு அடிப்படையில் செய்யப்படுகிறது. ஒரு பாதை உறுப்பு என்பது `/` பிரிப்பான்-ஆல் பிரிக்கப்பட்ட பாதையில் உள்ள முத்திரைகளின் (labels) பட்டியலை குறிக்கிறது. ஒவ்வொரு _p_ பாதையும் கோரிக்கை பாதையின் _p_-இன் உறுப்பு-வாரியாக முன்னொட்டாக இருந்தால் ஒரு கோரிக்கை _p_ பாதைக்கு பொருந்துகிறது.

  {{< note >}}
  பாதையின் கடைசி உறுப்பு கோரிக்கை பாதையில் உள்ள கடைசி உறுப்பின் ஒரு சரமாக இருந்தால், அது பொருந்தல் இல்லை (எடுத்துக்காட்டாக: `/foo/bar`
  `/foo/bar/baz`-ஐ பொருத்துகிறது, ஆனால் `/foo/barbaz`-ஐ பொருத்துவதில்லை).
  {{< /note >}}

### எடுத்துக்காட்டுகள் (Examples)

| Kind   | Path(s)                         | Request path(s)               | Matches?                           |
|--------|---------------------------------|-------------------------------|------------------------------------|
| Prefix | `/`                             | (all paths)                   | Yes                                |
| Exact  | `/foo`                          | `/foo`                        | Yes                                |
| Exact  | `/foo`                          | `/bar`                        | No                                 |
| Exact  | `/foo`                          | `/foo/`                       | No                                 |
| Exact  | `/foo/`                         | `/foo`                        | No                                 |
| Prefix | `/foo`                          | `/foo`, `/foo/`               | Yes                                |
| Prefix | `/foo/`                         | `/foo`, `/foo/`               | Yes                                |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`                    | No                                 |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`                    | Yes                                |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`                    | Yes, ignores trailing slash        |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`                   | Yes,  matches trailing slash       |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | Yes, matches subpath               |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | No, does not match string prefix   |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`                    | Yes, matches `/aaa` prefix         |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | Yes, matches `/aaa/bbb` prefix     |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | Yes, matches `/` prefix            |
| Prefix | `/aaa`                          | `/ccc`                        | No, uses default backend           |
| Mixed  | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | Yes, prefers Exact                 |

#### பல பொருத்தங்கள் (Multiple matches)

சில சந்தர்ப்பங்களில், ஒரு Ingress-ல் உள்ள பல பாதைகள் ஒரு கோரிக்கையுடன் பொருந்தும். அந்த சந்தர்ப்பங்களில் மிக நீளமான பொருந்தும் பாதைக்கு முன்னுரிமை வழங்கப்படும். இரண்டு பாதைகள் இன்னும் சமானமாக பொருந்தினால், prefix பாதை வகையை விட exact பாதை வகையுள்ள பாதைகளுக்கு முன்னுரிமை வழங்கப்படும்.

## ஹோஸ்ட்பெயர் wildcard-கள் (Hostname wildcards)

Hosts சரியான பொருத்தங்களாக இருக்கலாம் (எடுத்துக்காட்டாக "`foo.bar.com`") அல்லது wildcard (எடுத்துக்காட்டாக "`*.foo.com`"). சரியான பொருத்தங்களுக்கு HTTP `host` header `host` புலத்துடன் பொருந்த வேண்டும். Wildcard பொருத்தங்களுக்கு HTTP `host` header wildcard விதியின் பின்னொட்டுக்கு சமானமாக இருக்க வேண்டும்.

| Host        | Host header       | Match?                                            |
| ----------- |-------------------| --------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Matches based on shared suffix                    |
| `*.foo.com` | `baz.bar.foo.com` | No match, wildcard only covers a single DNS label |
| `*.foo.com` | `foo.com`         | No match, wildcard only covers a single DNS label |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

## Ingress class

Ingress-களை வெவ்வேறு controllers ஆல் செயல்படுத்தலாம், பெரும்பாலும் வெவ்வேறு உள்ளமைவுகளுடன். ஒவ்வொரு Ingress-உம் ஒரு class குறிப்பிட வேண்டும், அதாவது class-ஐ செயல்படுத்த வேண்டிய controller-இன் பெயர் உட்பட கூடுதல் உள்ளமைவை கொண்டிருக்கும் IngressClass வளத்திற்கான குறிப்பு.

{{% code_sample file="service/networking/external-lb.yaml" %}}

ஒரு IngressClass-இன் `.spec.parameters` புலம் அந்த IngressClass-க்கு தொடர்புடைய உள்ளமைவை வழங்கும் மற்றொரு வளத்தை குறிப்பிட அனுமதிக்கிறது.

பயன்படுத்த வேண்டிய parameters-இன் குறிப்பிட்ட வகை, IngressClass-இன் `.spec.controller` புலத்தில் நீங்கள் குறிப்பிடும் ingress controller-ஐ பொறுத்தது.

### IngressClass வீச்சு (IngressClass scope)

உங்கள் ingress controller-ஐ பொறுத்து, கொத்து-அளவில் (cluster-wide) அமைத்த parameters-ஐ அல்லது ஒரு Namespace-க்கு மட்டும் பயன்படுத்த முடியும்.

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Cluster" %}}
IngressClass parameters-க்கான இயல்புநிலை வீச்சு கொத்து-அளவில் உள்ளது.

நீங்கள் `.spec.parameters` புலத்தை அமைத்து `.spec.parameters.scope`-ஐ அமைக்கவில்லை என்றால், அல்லது நீங்கள் `.spec.parameters.scope`-ஐ `Cluster`-க்கு அமைத்தால், IngressClass ஒரு கொத்து-வீச்சு வளத்தை குறிக்கிறது.
parameters-இன் `kind` (`apiGroup`-உடன் இணைந்து) ஒரு கொத்து-வீச்சு API-ஐ (சாத்தியமாக ஒரு தனிப்பயன் வளம்) குறிக்கிறது, மேலும் parameters-இன் `name` அந்த API-க்கான குறிப்பிட்ட கொத்து வீச்சு வளத்தை அடையாளப்படுத்துகிறது.

எடுத்துக்காட்டாக:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in a
    # ClusterIngressParameter (API group k8s.example.net) named
    # "external-config-1". This definition tells Kubernetes to
    # look for a cluster-scoped parameter resource.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Namespaced" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

நீங்கள் `.spec.parameters` புலத்தை அமைத்து `.spec.parameters.scope`-ஐ `Namespace`-க்கு அமைத்தால், IngressClass ஒரு namespace-வீச்சு வளத்தை குறிக்கிறது. நீங்கள் பயன்படுத்த விரும்பும் parameters-ஐ கொண்ட Namespace-க்கு `.spec.parameters`-க்குள் `namespace` புலத்தையும் அமைக்க வேண்டும்.

parameters-இன் `kind` (`apiGroup`-உடன் இணைந்து) ஒரு namespace-API-ஐ (எடுத்துக்காட்டாக: ConfigMap) குறிக்கிறது, மேலும் parameters-இன் `name` `namespace`-ல் நீங்கள் குறிப்பிட்ட Namespace-ல் உள்ள குறிப்பிட்ட வளத்தை அடையாளப்படுத்துகிறது.

Namespace-வீச்சு parameters, பணிச்சுமைக்காக பயன்படுத்தப்படும் உள்ளமைவின் (எடுத்துக்காட்டாக: சுமை பகிர்வி (load balancer) அமைப்புகள், API gateway வரையறை) மீதான கட்டுப்பாட்டை வேறொரு குழுவிடம் கொத்து ஆபரேட்டர் (cluster operator) ஒப்படைக்க உதவுகிறது. நீங்கள் கொத்து-வீச்சு parameter பயன்படுத்தினால் அப்போது:

- புதிய உள்ளமைவு மாற்றம் பயன்படுத்தப்படும் ஒவ்வொரு முறையும் கொத்து ஆபரேட்டர் குழு வேறொரு குழுவின் மாற்றங்களை அங்கீகரிக்க வேண்டும்.
- கொத்து ஆபரேட்டர் குறிப்பிட்ட அணுகல் கட்டுப்பாடுகளை வரையறுக்க வேண்டும், அதாவது கொத்து-வீச்சு parameters வளத்தில் மாற்றங்கள் செய்ய பயன்பாட்டு குழுவை அனுமதிக்கும் [RBAC](/docs/reference/access-authn-authz/rbac/) பாத்திரங்கள் (roles) மற்றும் பிணைப்புகள் (bindings).

IngressClass API தன்னிலையே எப்போதும் கொத்து-வீச்சு ஆகும்.

namespace-வீச்சில் உள்ள parameters-ஐ குறிக்கும் IngressClass-இன் எடுத்துக்காட்டு இதோ:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in an
    # IngressParameter (API group k8s.example.com) named "external-config",
    # that's in the "external-configuration" namespace.
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### நீக்கப்பட்ட குறிப்பு (Deprecated annotation)

Kubernetes 1.18-ல் IngressClass வளம் மற்றும் `ingressClassName` புலம் சேர்க்கப்படுவதற்கு முன், Ingress classes-ஐ Ingress-ல் ஒரு `kubernetes.io/ingress.class` குறிப்பை (annotation) பயன்படுத்தி குறிப்பிட்டனர். இந்த குறிப்பு (annotation) ஒருபோதும் முறையாக வரையறுக்கப்படவில்லை, ஆனால் Ingress controllers ஆல் பரவலாக ஆதரிக்கப்பட்டது.

Ingresses-ல் புதிய `ingressClassName` புலம் அந்த குறிப்பிற்கு மாற்றீடு, ஆனால் நேரடி சமமானது அல்ல. குறிப்பு (annotation) பொதுவாக Ingress-ஐ செயல்படுத்த வேண்டிய Ingress controller-இன் பெயரை குறிப்பிட பயன்படுத்தப்பட்டது, இந்த புலம் Ingress controller-இன் பெயர் உட்பட கூடுதல் Ingress உள்ளமைவை கொண்டிருக்கும் IngressClass வளத்திற்கான குறிப்பாகும்.

### இயல்புநிலை IngressClass {#default-ingress-class}

உங்கள் கொத்துக்கு ஒரு குறிப்பிட்ட IngressClass-ஐ இயல்புநிலையாக குறிக்கலாம். ஒரு IngressClass வளத்தில் `ingressclass.kubernetes.io/is-default-class` குறிப்பை (annotation) `true`-க்கு அமைப்பது `ingressClassName` புலம் குறிப்பிடப்படாத புதிய Ingress-களுக்கு இந்த இயல்புநிலை IngressClass ஒதுக்கப்படுவதை உறுதி செய்யும்.

{{< caution >}}
உங்கள் கொத்துக்கு இயல்புநிலையாக குறிக்கப்பட்ட ஒன்றுக்கு மேற்பட்ட IngressClass இருந்தால், admission controller `ingressClassName` குறிப்பிடப்படாத புதிய Ingress பொருள்களை உருவாக்குவதை தடுக்கிறது. உங்கள் கொத்தில் அதிகபட்சம் 1 IngressClass இயல்புநிலையாக குறிக்கப்பட்டுள்ளதை உறுதி செய்வதன் மூலம் இதை தீர்க்கலாம்.
{{< /caution >}}

ஒரு இயல்புநிலை IngressClass-ஐ வரையறுப்பதில் தொடங்குங்கள். இருப்பினும், இயல்புநிலை IngressClass-ஐ குறிப்பிடுவது பரிந்துரைக்கப்படுகிறது:

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

## Ingress வகைகள் (Types of Ingress)

### ஒரே Service ஆல் ஆதரிக்கப்படும் Ingress {#single-service-ingress}

ஒரு தனி Service-ஐ வெளிப்படுத்த அனுமதிக்கும் ஏற்கனவே உள்ள Kubernetes கருத்துகள் உள்ளன ([மாற்றுகளை](#alternatives) பாருங்கள்). விதிகள் இல்லாமல் ஒரு *இயல்புநிலை backend*-ஐ குறிப்பிடுவதன் மூலம் Ingress-உடன் இதையும் செய்யலாம்.

{{% code_sample file="service/networking/test-ingress.yaml" %}}

`kubectl apply -f` பயன்படுத்தி நீங்கள் அதை உருவாக்கினால், நீங்கள் சேர்த்த Ingress-இன் நிலையை பார்க்க முடியும்:

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

`203.0.113.123` என்பது இந்த Ingress-ஐ நிறைவேற்ற Ingress controller ஆல் ஒதுக்கப்பட்ட IP ஆகும்.

{{< note >}}
Ingress controllers மற்றும் சுமை பகிர்விகளுக்கு (load balancers) ஒரு IP முகவரியை ஒதுக்க ஒரு அல்லது இரண்டு நிமிடங்கள் ஆகலாம். அந்த நேரம் வரை, நீங்கள் அடிக்கடி முகவரியை `<pending>` என்று பட்டியலிடப்பட்டதாக பார்ப்பீர்கள்.
{{< /note >}}

### எளிய fanout

ஒரு fanout உள்ளமைவு ஒரே IP முகவரியிலிருந்து கோரப்படும் HTTP URI-ன் அடிப்படையில் ஒன்றுக்கு மேற்பட்ட Service-களுக்கு போக்குவரத்தை திருப்பி விடுகிறது. ஒரு Ingress சுமை பகிர்விகளின் (load balancers) எண்ணிக்கையை குறைந்தபட்சமாக வைத்திருக்க அனுமதிக்கிறது. எடுத்துக்காட்டாக, இது போன்ற ஒரு அமைப்பு:

{{< figure src="/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="Figure. Ingress Fan Out" link="https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ" >}}

இது இது போன்ற Ingress தேவைப்படும்:

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

`kubectl apply -f`-உடன் Ingress-ஐ உருவாக்கும்போது:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

Ingress controller சேவைகள் (`service1`, `service2`) இருக்கும் வரை Ingress-ஐ நிறைவேற்றும் செயலாக்க-குறிப்பிட்ட சுமை பகிர்வியை (load balancer) ஒதுக்குகிறது. அதை முடிந்த பிறகு, Address புலத்தில் சுமை பகிர்வியின் (load balancer) முகவரியை பார்க்கலாம்.

{{< note >}}
நீங்கள் பயன்படுத்தும் [Ingress controller](/docs/concepts/services-networking/ingress-controllers/)-ஐ பொறுத்து, ஒரு default-http-backend [Service](/docs/concepts/services-networking/service/)-ஐ உருவாக்க வேண்டியிருக்கலாம்.
{{< /note >}}

### பெயர் அடிப்படையிலான மெய்நிகர் ஹோஸ்டிங் (Name based virtual hosting)

பெயர் அடிப்படையிலான மெய்நிகர் ஹோஸ்ட்கள் ஒரே IP முகவரியில் பல ஹோஸ்ட் பெயர்களுக்கு HTTP போக்குவரத்தை திருப்பி விடுவதை ஆதரிக்கின்றன.

{{< figure src="/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="Figure. Ingress Name Based Virtual hosting" link="https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu" >}}

பின்வரும் Ingress backing சுமை பகிர்வியை (load balancer) [Host header](https://tools.ietf.org/html/rfc7230#section-5.4)-ன் அடிப்படையில் கோரிக்கைகளை திருப்பி விடும்படி கூறுகிறது.

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

விதிகளில் வரையறுக்கப்பட்ட எந்த hosts-உம் இல்லாமல் ஒரு Ingress வளத்தை உருவாக்கினால், உங்கள் Ingress controller-இன் IP முகவரிக்கான எந்த இணைய போக்குவரத்தும் பெயர் அடிப்படையிலான மெய்நிகர் host தேவைப்படாமல் பொருத்தப்படலாம்.

எடுத்துக்காட்டாக, பின்வரும் Ingress `first.bar.com`-க்காக கோரப்பட்ட போக்குவரத்தை `service1`-க்கும், `second.bar.com`-க்கு `service2`-க்கும், மற்றும் `first.bar.com` மற்றும் `second.bar.com`-உடன் பொருந்தாத கோரிக்கை host header-உள்ள எந்த போக்குவரத்தையும் `service3`-க்கும் திருப்பி விடுகிறது.

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS

TLS private key மற்றும் சான்றிதழ் (certificate) கொண்ட {{< glossary_tooltip term_id="secret" >}}-ஐ குறிப்பிடுவதன் மூலம் ஒரு Ingress-ஐ பாதுகாக்கலாம். Ingress வளம் ஒரே ஒரு TLS port-ஐ மட்டும், 443-ஐ, ஆதரிக்கிறது, மேலும் ingress புள்ளியில் TLS முடிக்கப்படுகிறது என்று கருதுகிறது (Service மற்றும் அதன் Pod-களுக்கான போக்குவரத்து plaintext-ல் உள்ளது). ஒரு Ingress-ல் TLS உள்ளமைவு பிரிவு வெவ்வேறு hosts-ஐ குறிப்பிட்டால், SNI TLS நீட்டிப்பு மூலம் குறிப்பிடப்பட்ட hostname-ன் படி அதே port-ல் multiplexed செய்யப்படுகின்றன (Ingress controller SNI-ஐ ஆதரிக்கும் என்று வழங்கப்பட்டது). TLS secret-ல் TLS-க்காக பயன்படுத்த சான்றிதழ் (certificate) மற்றும் private key-ஐ கொண்ட `tls.crt` மற்றும் `tls.key` என்ற பெயரிடப்பட்ட keys இருக்க வேண்டும். எடுத்துக்காட்டாக:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

ஒரு Ingress-ல் இந்த secret-ஐ குறிப்பிடுவது TLS-ஐ பயன்படுத்தி வாடிக்கையாளரிலிருந்து சுமை பகிர்வி (load balancer) வரையிலான சேனலை பாதுகாக்க Ingress controller-க்கு கூறுகிறது. `https-example.foo.com`-க்கு Fully Qualified Domain Name (FQDN) என்றும் அழைக்கப்படும் Common Name (CN) கொண்ட சான்றிதழிலிருந்து (certificate) நீங்கள் உருவாக்கிய TLS secret வந்தது என்பதை உறுதிப்படுத்த வேண்டும்.

{{< note >}}
இயல்புநிலை விதியில் TLS வேலை செய்யாது என்பதை நினைவில் கொள்ளுங்கள், ஏனென்றால் சான்றிதழ்கள் (certificates) அனைத்து சாத்தியமான துணை-டொமைன்களுக்கும் வழங்கப்பட வேண்டும். எனவே, `tls` பிரிவில் உள்ள `hosts` `rules` பிரிவில் உள்ள `host`-உடன் வெளிப்படையாக பொருந்த வேண்டும்.
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
பல்வேறு ingress controllers ஆல் ஆதரிக்கப்படும் TLS அம்சங்களுக்கிடையே இடைவெளி உள்ளது. TLS உங்கள் சூழலில் எவ்வாறு வேலை செய்கிறது என்பதை புரிந்துகொள்ள நீங்கள் தேர்ந்தெடுத்த ingress controller(s)-இன் ஆவணத்தை குறிப்பிட வேண்டும்.
{{< /note >}}

### சுமை பகிர்வு (Load balancing) {#load-balancing}

ஒரு Ingress controller சுமை பகிர்வு (load balancing) வழிமுறை அமைப்புகள், backend எடை திட்டம் மற்றும் பிறவை போன்ற சில சுமை பகிர்வு கொள்கை அமைப்புகளுடன் bootstrap செய்யப்படுகிறது, இது அனைத்து Ingress-களுக்கும் பொருந்துகிறது. மேம்பட்ட சுமை பகிர்வு கருத்துகள் (எ.கா. நிலையான sessions, dynamic weights) இன்னும் Ingress மூலம் வெளிப்படுத்தப்படவில்லை. அதற்கு பதிலாக ஒரு Service-க்காக பயன்படுத்தப்படும் சுமை பகிர்வி மூலம் இந்த அம்சங்களை பெறலாம்.

நேரடியாக Ingress மூலம் health checks வெளிப்படுத்தப்படவில்லை என்றாலும், ஒரே இறுதி முடிவை அடைய அனுமதிக்கும் [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) போன்ற Kubernetes-ல் இணை கருத்துகள் உள்ளன என்பது குறிப்பிடத்தக்கது. health checks-ஐ எவ்வாறு கையாளுகிறார்கள் என்பதை பார்க்க controller குறிப்பிட்ட ஆவணத்தை மதிப்பாய்வு செய்யுங்கள்.

## Ingress-ஐ புதுப்பித்தல் (Updating an Ingress)

ஒரு புதிய Host சேர்க்க ஏற்கனவே உள்ள Ingress-ஐ புதுப்பிக்க, வளத்தை திருத்துவதன் மூலம் புதுப்பிக்கலாம்:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

இது ஒரு editor-ஐ YAML வடிவத்தில் ஏற்கனவே உள்ள உள்ளமைவுடன் திறக்கிறது. புதிய Host சேர்க்க திருத்துங்கள்:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

மாற்றங்களை சேமித்த பிறகு, kubectl API சேவையகத்தில் (API server) வளத்தை புதுப்பிக்கிறது, இது சுமை பகிர்வியை (load balancer) மீண்டும் உள்ளமைவு செய்ய Ingress controller-க்கு கூறுகிறது.

இதை சரிபார்க்கவும்:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

மாற்றியமைக்கப்பட்ட Ingress YAML கோப்பில் `kubectl replace -f`-ஐ அழைப்பதன் மூலம் அதே முடிவை அடையலாம்.

## கிடைக்கும் மண்டலங்கள் முழுவதும் தோல்வி (Failing across availability zones)

தோல்வி மண்டலங்கள் முழுவதும் போக்குவரத்தை பரப்புவதற்கான நுட்பங்கள் cloud வழங்குனர்களுக்கு இடையே வேறுபடுகின்றன. விவரங்களுக்கு தொடர்புடைய [Ingress controller](/docs/concepts/services-networking/ingress-controllers)-இன் ஆவணத்தை சரிபார்க்கவும்.

## மாற்றுகள் (Alternatives)

Ingress வளத்தை நேரடியாக சம்பந்தப்படுத்தாமல் ஒரு Service-ஐ பல வழிகளில் வெளிப்படுத்தலாம்:

* [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) பயன்படுத்துக
* [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) பயன்படுத்துக

## {{% heading "whatsnext" %}}

* [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API பற்றி அறியுங்கள்
* [Ingress controllers](/docs/concepts/services-networking/ingress-controllers/) பற்றி அறியுங்கள்
