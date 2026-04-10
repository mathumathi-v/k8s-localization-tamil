---
reviewers:
- erictune
- thockin
title: படங்கள் (Images)
content_type: concept
weight: 10
hide_summary: true
---

<!-- overview -->

ஒரு கொள்கலன் படம் (container image) என்பது ஒரு பயன்பாட்டையும் அதன் அனைத்து
மென்பொருள் சார்புகளையும் உள்ளடக்கிய இருமம் (binary) தரவாகும். கொள்கலன் படங்கள்
தனித்து இயங்கக்கூடிய இயங்கதகு மென்பொருள் தொகுப்புகள் ஆகும், மேலும் அவை தங்கள்
இயக்க சூழலைப் பற்றி மிகவும் தெளிவான அனுமானங்களை வைத்திருக்கின்றன.

நீங்கள் பொதுவாக உங்கள் பயன்பாட்டின் கொள்கலன் படத்தை உருவாக்கி, ஒரு
{{< glossary_tooltip text="Pod" term_id="pod" >}}-இல் குறிப்பிடுவதற்கு முன்பு
அதை ஒரு registry-க்கு push செய்வீர்கள்.

இந்தப் பக்கம் கொள்கலன் படம் என்ற கருத்தாக்கின் அவுட்லைனை வழங்குகிறது.

{{< note >}}
Kubernetes வெளியீட்டிற்கான கொள்கலன் படங்களை (v{{< skew latestVersion >}} போன்றவை)
தேடுகிறீர்களெனில், [Download Kubernetes](https://kubernetes.io/releases/download/)-ஐப் பார்வையிடவும்.
{{< /note >}}

<!-- body -->

## படங்களின் பெயர்கள் (Image names)

கொள்கலன் படங்களுக்கு பொதுவாக `pause`, `example/mycontainer`, அல்லது `kube-apiserver` என்று
பெயரிடப்படும். படங்களில் registry hostname-ஐயும் சேர்க்கலாம்; உதாரணமாக:
`fictional.registry.example/imagename`, மற்றும் சாத்தியமாக port எண்ணும்; உதாரணமாக:
`fictional.registry.example:10443/imagename`.

Registry hostname குறிப்பிடவில்லையெனில், Kubernetes
[Docker public registry](https://hub.docker.com/)-ஐ குறிக்கிறீர்கள் என்று கருதுகிறது.
[container runtime](/docs/setup/production-environment/container-runtimes/) உள்ளமைவில்
இயல்புநிலை image registry-ஐ அமைப்பதன் மூலம் இந்த நடத்தையை மாற்றலாம்.

படத்தின் பெயருக்குப் பிறகு ஒரு _tag_ அல்லது _digest_ சேர்க்கலாம் (`docker` அல்லது `podman`
கட்டளைகளில் பயன்படுத்துவதைப் போல). Tag-கள் ஒரே தொடரின் படங்களின் பல்வேறு பதிப்புகளை
அடையாளப்படுத்த உதவுகின்றன. Digest என்பது ஒரு படத்தின் குறிப்பிட்ட பதிப்பிற்கான
தனித்துவமான அடையாளி. Digest-கள் படத்தின் உள்ளடக்கத்தின் hash ஆகும், மற்றும் மாறாதவை.
Tag-கள் வேறு படங்களை சுட்டும்படி நகர்த்தப்படலாம், ஆனால் digest-கள் நிலையானவை.

Tag குறிப்பிடவில்லையெனில், Kubernetes `latest` என்ற tag-ஐக் குறிக்கிறீர்கள் என்று கருதும்.

Kubernetes பயன்படுத்தக்கூடிய சில படப் பெயர் உதாரணங்கள்:

- `busybox` — படப் பெயர் மட்டும், tag அல்லது digest இல்லை. `docker.io/library/busybox:latest`-க்கு சமம்.
- `busybox:1.32.0` — tag-உடன் படப் பெயர். `docker.io/library/busybox:1.32.0`-க்கு சமம்.
- `registry.k8s.io/pause:latest` — தனிப்பயன் registry மற்றும் latest tag உடன் படப் பெயர்.
- `registry.k8s.io/pause:3.5` — தனிப்பயன் registry மற்றும் latest அல்லாத tag உடன் படப் பெயர்.
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` — digest உடன் படப் பெயர்.
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` — tag மற்றும் digest உடன் படப் பெயர். இழுக்க (pull) digest மட்டுமே பயன்படுத்தப்படும்.

## படங்களை புதுப்பித்தல் (Updating images)

{{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod அல்லது
PodTemplate உள்ளடக்கிய பிற பொருளை முதலில் உருவாக்கும்போது, pull policy வெளிப்படையாக
குறிப்பிடவில்லையெனில், அந்த Pod-இல் உள்ள அனைத்து கொள்கலன்களுக்கும் pull policy
இயல்பாக `IfNotPresent`-ஆக அமைக்கப்படும். இந்த policy,
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}-ஐ ஒரு படம் ஏற்கனவே
இருந்தால் அதை இழுப்பதைத் தவிர்க்கும்.

### படம் இழுக்கும் policy (Image pull policy)

ஒரு கொள்கலனின் `imagePullPolicy` மற்றும் படத்தின் tag ஆகியவை,
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) குறிப்பிட்ட படத்தை
இழுக்க (download செய்ய) எப்போது முயற்சிக்கிறது என்பதை பாதிக்கின்றன.

`imagePullPolicy`-க்கு அமைக்கக்கூடிய மதிப்புகளும் அவற்றின் விளைவுகளும்:

`IfNotPresent`
: படம் உள்ளூரில் ஏற்கனவே இல்லாவிட்டால் மட்டுமே இழுக்கப்படும்.

`Always`
: kubelet ஒவ்வொரு முறை கொள்கலனை தொடங்கும்போதும், படத்தின் பெயரை ஒரு image
  [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)-ஆக
  தீர்க்க container image registry-ஐ query செய்யும். அந்த digest உள்ளூரில் cache ஆகியிருந்தால்
  அந்தப் படத்தை பயன்படுத்தும்; இல்லையெனில், தீர்க்கப்பட்ட digest உடன் படத்தை இழுக்கும்.

`Never`
: kubelet படத்தை பெற முயற்சிக்காது. படம் உள்ளூரில் இருந்தால் கொள்கலனை தொடங்க
  முயற்சிக்கும்; இல்லையெனில், தொடக்கம் தோல்வியடையும்.
  மேலும் விவரங்களுக்கு [pre-pulled images](#pre-pulled-images)-ஐப் பார்க்கவும்.

{{< note >}}
Production-இல் கொள்கலன்களை deploy செய்யும்போது `:latest` tag-ஐ தவிர்க்க வேண்டும்,
ஏனெனில் எந்த பதிப்பு இயங்குகிறது என்பதை கண்காணிக்கவும் rollback செய்யவும் கடினமாக இருக்கும்.

அதற்கு பதிலாக `v1.42.0` போன்ற அர்த்தமுள்ள tag மற்றும்/அல்லது digest குறிப்பிடவும்.
{{< /note >}}

Pod எப்பொழுதும் ஒரே பதிப்பு கொள்கலன் படத்தைப் பயன்படுத்துவதை உறுதிப்படுத்த,
படத்தின் digest-ஐ குறிப்பிடலாம்; `<image-name>:<tag>`-ஐ
`<image-name>@<digest>`-ஆக மாற்றவும்.

#### இயல்புநிலை image pull policy {#imagepullpolicy-defaulting}

API server-க்கு புதிய Pod சமர்ப்பிக்கும்போது, கொத்து (Cluster) சில நிபந்தனைகளில்
`imagePullPolicy` புலத்தை அமைக்கிறது:

- `imagePullPolicy` புலத்தை தவிர்த்தால், கொள்கலன் படத்திற்கு digest குறிப்பிட்டால்,
  `imagePullPolicy` தானாக `IfNotPresent`-ஆக அமைக்கப்படும்.
- `imagePullPolicy` புலத்தை தவிர்த்தால், tag `:latest` என்றால்,
  `imagePullPolicy` தானாக `Always`-ஆக அமைக்கப்படும்.
- `imagePullPolicy` புலத்தை தவிர்த்தால், tag குறிப்பிடவில்லையென்றால்,
  `imagePullPolicy` தானாக `Always`-ஆக அமைக்கப்படும்.
- `imagePullPolicy` புலத்தை தவிர்த்தால், `:latest` அல்லாத tag குறிப்பிட்டால்,
  `imagePullPolicy` தானாக `IfNotPresent`-ஆக அமைக்கப்படும்.

{{< note >}}
கொள்கலனின் `imagePullPolicy` மதிப்பு பொருள் முதலில் _உருவாக்கப்படும்போது_ எப்பொழுதும்
அமைக்கப்படும், மேலும் படத்தின் tag அல்லது digest பின்னர் மாறினாலும் புதுப்பிக்கப்படாது.
{{< /note >}}

#### கட்டாய image pull

எப்போதும் pull-ஐ கட்டாயப்படுத்த, பின்வருவனவற்றில் ஒன்றைச் செய்யலாம்:

- கொள்கலனின் `imagePullPolicy`-ஐ `Always`-ஆக அமைக்கவும்.
- `imagePullPolicy`-ஐ தவிர்த்து படத்திற்கு `:latest` tag பயன்படுத்தவும்.
- `imagePullPolicy` மற்றும் tag இரண்டையும் தவிர்க்கவும்.
- [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  admission controller-ஐ இயக்கவும்.

### ImagePullBackOff

ஒரு kubelet கொள்கலன் runtime மூலம் Pod-க்கான கொள்கலன்களை உருவாக்கத் தொடங்கும்போது,
`ImagePullBackOff` காரணமாக கொள்கலன்
[Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)
நிலையில் இருக்கலாம்.

`ImagePullBackOff` நிலை என்பது Kubernetes கொள்கலன் படத்தை இழுக்க முடியாததால் ஒரு
கொள்கலன் தொடங்க முடியவில்லை என்று பொருள் (தவறான படப் பெயர் அல்லது `imagePullSecret`
இல்லாமல் private registry-இல் இருந்து இழுக்கும்போது). `BackOff` என்பது Kubernetes
அதிகரிக்கும் back-off தாமதத்துடன் படத்தை இழுக்க தொடர்ந்து முயற்சிக்கும் என்று குறிக்கிறது.

Kubernetes ஒவ்வொரு முயற்சிக்கும் இடையேயான தாமதத்தை குறியிடப்பட்ட வரம்பான
300 வினாடிகள் (5 நிமிடங்கள்) வரை அதிகரிக்கும்.

## Image indexes மூலம் பல-கட்டமைப்பு படங்கள் (Multi-architecture images with image indexes)

இருமம் படங்களை வழங்குவதோடு, ஒரு container registry ஒரு
[container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md)-ஐயும்
வழங்க முடியும். ஒரு image index, கொள்கலனின் கட்டமைப்பு-குறிப்பிட்ட பதிப்புகளுக்கான
பல [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md)-ஐ
சுட்டி காட்டலாம். யோசனை என்னவெனில், ஒரு படத்திற்கு ஒரு பெயர் வைத்து (உதாரணமாக:
`pause`, `example/mycontainer`, `kube-apiserver`) வெவ்வேறு சிஸ்டம்கள் தங்கள்
இயந்திர கட்டமைப்பிற்கான சரியான இருமம் படத்தை பெறலாம்.

Kubernetes திட்டம் பொதுவாக `-$(ARCH)` suffix உடன் கொள்கலன் படங்களை உருவாக்குகிறது.
பழைய இணக்கத்திற்காக, suffix-கள் உடன் பழைய படங்களை உருவாக்கவும்.

## தனிப்பட்ட registry பயன்படுத்துதல் (Using a private registry)

தனிப்பட்ட registry-கள் படங்களை கண்டறிய மற்றும்/அல்லது இழுக்க authentication தேவைப்படலாம்.
Credentials பல வழிகளில் வழங்கலாம்:

- [Pod வரையறையில் `imagePullSecrets` குறிப்பிடுதல்](#specifying-imagepullsecrets-on-a-pod)

  சொந்த keys வழங்கும் Pod-கள் மட்டுமே private registry-ஐ அணுக முடியும்.

- [தனிப்பட்ட Registry-க்கு authenticate செய்ய Node-களை உள்ளமைத்தல்](#configuring-nodes-to-authenticate-to-a-private-registry)
  - அனைத்து Pod-களும் உள்ளமைக்கப்பட்ட private registry-களை படிக்கலாம்.
  - கொத்து (cluster) நிர்வாகியால் node உள்ளமைவு தேவைப்படும்.

- தனிப்பட்ட registry-களுக்கான credentials இயக்கப் பெறுவதற்கு _kubelet credential provider_ plugin பயன்படுத்துதல்.

- [முன்பே இழுக்கப்பட்ட படங்கள் (Pre-pulled Images)](#pre-pulled-images)
  - அனைத்து Pod-களும் node-இல் cache ஆன படங்களைப் பயன்படுத்தலாம்.
  - அமைக்க அனைத்து node-களுக்கும் root அணுகல் தேவைப்படும்.

### Pod-இல் `imagePullSecrets` குறிப்பிடுதல் {#specifying-imagepullsecrets-on-a-pod}

{{< note >}}
இது private registry-களில் உள்ள படங்களை அடிப்படையாகக் கொண்ட கொள்கலன்களை
இயக்குவதற்கு பரிந்துரைக்கப்பட்ட அணுகுமுறையாகும்.
{{< /note >}}

Kubernetes ஒரு Pod-இல் container image registry keys குறிப்பிடுவதை ஆதரிக்கிறது.
அனைத்து `imagePullSecrets`-ம் Pod-ஐப் போன்ற அதே
{{< glossary_tooltip term_id="namespace" >}}-இல் இருக்கும் Secrets ஆக இருக்க வேண்டும்.
இந்த Secrets `kubernetes.io/dockercfg` அல்லது `kubernetes.io/dockerconfigjson` வகையாக இருக்க வேண்டும்.

### தனிப்பட்ட registry-க்கு authenticate செய்ய node-களை உள்ளமைத்தல் {#configuring-nodes-to-authenticate-to-a-private-registry}

Credentials அமைப்பதற்கான குறிப்பிட்ட வழிமுறைகள் நீங்கள் தேர்ந்தெடுத்த container
runtime மற்றும் registry-ஐப் பொறுத்தது. மிகவும் துல்லியமான தகவலுக்கு உங்கள்
தீர்வின் ஆவணங்களை பார்க்கவும்.

தனிப்பட்ட container image registry-ஐ உள்ளமைப்பதற்கான உதாரணத்திற்கு,
[Pull an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)
task-ஐப் பார்க்கவும்.

### authenticated image pulls-க்கான kubelet credential provider {#kubelet-credential-provider}

container image-க்கான registry credentials-ஐ இயக்கமாக பெற ஒரு plugin binary-ஐ
அழைக்கும்படி kubelet-ஐ உள்ளமைக்கலாம். இது private registry-களுக்கான credentials
பெற மிகவும் வலிமையான மற்றும் பல்துறை வழியாகும், ஆனால் இயக்க kubelet அளவிலான
உள்ளமைவு தேவைப்படும்.

மேலும் விவரங்களுக்கு [Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/)-ஐப் பார்க்கவும்.

### config.json-ன் விளக்கம் {#config-json}

`config.json`-ன் விளக்கம் அசல் Docker implementation-க்கும் Kubernetes
interpretation-க்கும் இடையே வேறுபடுகிறது. Docker-இல், `auths` keys root URL-களை
மட்டுமே குறிப்பிட முடியும், ஆனால் Kubernetes glob URL-களையும் prefix-matched paths-ஐயும்
அனுமதிக்கிறது.

இது valid `config.json` ஆகும்:

```json
{
    "auths": {
        "my-registry.example/images": { "auth": "…" },
        "*.my-registry.example/images": { "auth": "…" }
    }
}
```

Image pull operations ஒவ்வொரு valid pattern-க்கும் CRI container runtime-க்கு
credentials அனுப்புகின்றன. பின்வரும் container image பெயர்கள் வெற்றிகரமாக பொருந்தும்:

- `my-registry.example/images`
- `my-registry.example/images/my-image`
- `sub.my-registry.example/images/my-image`

ஆனால் இவை பொருந்தாது:

- `a.sub.my-registry.example/images/my-image`

### முன்பே இழுக்கப்பட்ட படங்கள் (Pre-pulled images) {#pre-pulled-images}

{{< note >}}
இந்த அணுகுமுறை node உள்ளமைவை கட்டுப்படுத்த முடிந்தால் பொருத்தமானது.
உங்கள் cloud provider node-களை நிர்வகித்து தானாக மாற்றினால் இது நம்பகமாக
வேலை செய்யாது.
{{< /note >}}

இயல்பாக, kubelet குறிப்பிட்ட registry-இல் இருந்து ஒவ்வொரு படத்தையும் இழுக்க
முயற்சிக்கும். ஆனால், கொள்கலனின் `imagePullPolicy` property `IfNotPresent` அல்லது
`Never`-ஆக அமைக்கப்பட்டிருந்தால், ஒரு உள்ளூர் படம் பயன்படுத்தப்படும்
(முன்னுரிமையாக அல்லது பிரத்தியேகமாக).

Registry authentication-க்கு மாற்றாக முன்பே இழுக்கப்பட்ட படங்களை நம்பினால்,
கொத்தில் (cluster) உள்ள அனைத்து node-களிலும் அதே முன்பே இழுக்கப்பட்ட படங்கள்
இருப்பதை உறுதிசெய்ய வேண்டும்.

### Docker config உடன் Secret உருவாக்குதல்

Registry-க்கு authenticate செய்ய username, registry password மற்றும் client email
முகவரி தேவைப்படும். பின்வரும் கட்டளையை இயக்கவும்:

```shell
kubectl create secret docker-registry <name> \
  --docker-server=<docker-registry-server> \
  --docker-username=<docker-user> \
  --docker-password=<docker-password> \
  --docker-email=<docker-email>
```

ஏற்கனவே Docker credentials file இருந்தால், அதை Kubernetes
{{< glossary_tooltip text="Secret" term_id="secret" >}}-ஆக இறக்குமதி செய்யலாம்.

{{< note >}}
Pod-கள் தங்கள் சொந்த namespace-இல் மட்டுமே image pull secrets-ஐ குறிப்பிட முடியும்,
எனவே இந்த செயல்முறை ஒவ்வொரு namespace-க்கும் ஒரு முறை செய்ய வேண்டும்.
{{< /note >}}

#### Pod-இல் `imagePullSecrets` குறிப்பிடுதல்

அந்த secret-ஐ குறிப்பிடும் Pod-களை உருவாக்க, Pod வரையறையில் `imagePullSecrets`
பிரிவை சேர்க்கவும். `imagePullSecrets` array-இல் உள்ள ஒவ்வொரு item-ம் அதே
namespace-இல் உள்ள ஒரு Secret-ஐ மட்டுமே குறிப்பிட முடியும்.

உதாரணமாக:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

ஒரு [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)
resource-இல் `imagePullSecrets` குறிப்பிடுவதன் மூலம் இந்த செயல்முறையை தானியக்கமாக்கலாம்.

### பயன்பாட்டு சூழல்கள் (Use cases)

தனிப்பட்ட registry-களை உள்ளமைவதற்கான பல தீர்வுகள் உள்ளன. சில பொதுவான
பயன்பாட்டு சூழல்களும் பரிந்துரைக்கப்பட்ட தீர்வுகளும் இங்கே உள்ளன:

1. உரிமையற்ற (open-source) படங்களை மட்டும் இயக்கும் கொத்து (Cluster). படங்களை மறைக்க வேண்டியதில்லை.
   - public registry-இல் இருந்து public படங்களைப் பயன்படுத்தவும்.
     - உள்ளமைவு தேவையில்லை.
1. சில உரிமையான படங்களை இயக்கும் கொத்து, அவை நிறுவனத்திற்கு வெளியே மறைக்கப்பட வேண்டியவை.
   - hosted private registry பயன்படுத்தவும்.
   - அல்லது, `imagePullSecrets` பயன்படுத்தவும்.
1. கடுமையான அணுகல் கட்டுப்பாடு தேவைப்படும் உரிமையான படங்கள் உள்ள கொத்து.
   - [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     செயலில் இருப்பதை உறுதிசெய்யவும்.
   - sensitive data-ஐ படத்தில் பேக்கேஜ் செய்வதற்கு பதிலாக Secret resource-இல் நகர்த்தவும்.
1. ஒவ்வொரு tenant-க்கும் சொந்த private registry தேவைப்படும் multi-tenant கொத்து.
   - [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     செயலில் இருப்பதை உறுதிசெய்யவும்.
   - authorization தேவைப்படும் private registry இயக்கவும்.
   - ஒவ்வொரு tenant-க்கும் registry credentials உருவாக்கி, Secret-ஆக சேமித்து,
     ஒவ்வொரு tenant namespace-க்கும் பரப்பவும்.
   - tenant பின்னர் ஒவ்வொரு namespace-இன் `imagePullSecrets`-க்கும் அந்த Secret-ஐ சேர்க்கிறார்.

பல registry-களுக்கு அணுகல் தேவைப்பட்டால், ஒவ்வொரு registry-க்கும் ஒரு Secret உருவாக்கலாம்.

## {{% heading "whatsnext" %}}

* [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/main/manifest.md)-ஐப் படிக்கவும்.
* [container image garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection) பற்றி அறியவும்.
* [Pull an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)-ஐப் பற்றி மேலும் அறியவும்.
