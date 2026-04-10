---
title: StorageClasses (சேமிப்பக வகுப்புகள்)
content_type: concept
weight: 40
---

<!-- overview -->

இந்த ஆவணம் Kubernetes இல் உள்ள StorageClass என்ற கருத்தாக்கத்தை விளக்குகிறது. [தொகுதிகள் (Volumes)](/docs/concepts/storage/volumes/) மற்றும் [நிலையான தொகுதிகள் (PersistentVolumes)](/docs/concepts/storage/persistent-volumes/) பற்றிய அறிவு பரிந்துரைக்கப்படுகிறது.

<!-- body -->

## அறிமுகம் (Introduction)

ஒரு StorageClass என்பது நிர்வாகிகளுக்கு (administrators) தாங்கள் வழங்கும் சேமிப்பகத்தின் (storage) _வகுப்புகளை (classes)_ விவரிக்க ஒரு வழிமுறையை வழங்குகிறது. வெவ்வேறு வகுப்புகள் சேவை-தர (quality-of-service) நிலைகளுக்கு, அல்லது காப்பு கொள்கைகளுக்கு (backup policies), அல்லது நிர்வாகிகளால் தீர்மானிக்கப்பட்ட விருப்பமான கொள்கைகளுக்கு ஒத்திருக்கலாம். Kubernetes இந்த வகுப்புகள் எதை குறிக்கின்றன என்று கருத்து கொள்வதில்லை. மற்ற சேமிப்பக அமைப்புகளில் இந்த கருத்தாக்கம் சில நேரங்களில் "profiles" என அழைக்கப்படுகிறது.

## StorageClass வளம் (The StorageClass Resource)

ஒவ்வொரு StorageClass உம் `provisioner`, `parameters`, மற்றும் `reclaimPolicy` வயல்களை (fields) கொண்டுள்ளது. இவை StorageClass க்கு சொந்தமான PersistentVolume ஐ மாறும் வகையில் (dynamically) வழங்கும்போது பயன்படுகின்றன.

ஒரு StorageClass பொருளின் (object) பெயர் முக்கியமானது, மேலும் பயனர்கள் ஒரு குறிப்பிட்ட வகுப்பை எவ்வாறு கோரலாம் என்பதை இது விவரிக்கிறது. நிர்வாகிகள் StorageClass பொருளை முதலில் உருவாக்கும்போது அதன் பெயர் மற்றும் பிற அளவுருக்களை (parameters) அமைக்கிறார்கள், மேலும் பொருள் உருவாக்கப்பட்டவுடன் புதுப்பிக்க (update) முடியாது.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: low-latency
  annotations:
    storageclass.kubernetes.io/is-default-class: "false"
provisioner: csi-driver.example-vendor.example
reclaimPolicy: Retain
allowVolumeExpansion: true
mountOptions:
  - discard
volumeBindingMode: WaitForFirstConsumer
parameters:
  guaranteedReadWriteLatency: "true"
```

### வழங்குனர் (Provisioner)

ஒவ்வொரு StorageClass உம் PV வழங்குவதற்கு எந்த தொகுதி சொருகியை (volume plugin) பயன்படுத்துவது என்று தீர்மானிக்கும் ஒரு வழங்குனரை (provisioner) கொண்டுள்ளது. இந்த வயல் குறிப்பிடப்பட வேண்டும்.

| தொகுதி சொருகி | உள்ளமைக்கப்பட்ட வழங்குனர் | உள்ளமைப்பு உதாரணம் |
|---------------|--------------------------|---------------------|
| AzureFile | ✓ | [Azure File](https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-file) |
| Portworx | ✓ | [Portworx Volume](https://kubernetes.io/docs/concepts/storage/storage-classes/#portworx-volume) |
| vSphere | ✓ | [vSphere](https://kubernetes.io/docs/concepts/storage/storage-classes/#vsphere) |

உள்ளமைக்கப்பட்ட வழங்குனர்கள் குறிப்பிட்டுள்ளது போல் `kubernetes.io` என்ற பெயரிட இடத்தால் (prefix) குறிக்கப்படுகின்றன. Kubernetes இல் கப்பல் ஏற்றப்பட்ட (shipped) உள்ளமைக்கப்பட்ட வழங்குனர்களோடு நீங்கள் இயங்க முடியும், அல்லது தனிப்படுத்தப்பட்ட சேமிப்பக வழங்குனர்களை இயக்க மற்றும் குறிப்பிட முடியும்.

CSI வழங்குனர்கள் (CSI provisioners):

- மூன்றாம் தரப்பினரால் (third parties) உருவாக்கப்பட்டு பராமரிக்கப்படுகின்றன.
- Kubernetes ஆல் நிர்வகிக்கப்படும் CSI spec க்கு ஏற்ப செயல்படுகின்றன.
- `kubernetes.io` என்ற பெயரிட இடத்தை (prefix) பயன்படுத்துவதில்லை.

### மீட்பு கொள்கை (Reclaim Policy)

StorageClass மூலம் மாறும் வகையில் (dynamically) உருவாக்கப்பட்ட PersistentVolumes கள் StorageClass இன் `reclaimPolicy` வயலில் குறிப்பிட்டுள்ள மீட்பு கொள்கையுடன் (reclaim policy) உருவாக்கப்படும், இது `Delete` அல்லது `Retain` ஆக இருக்கலாம். StorageClass பொருளை உருவாக்கும்போது `reclaimPolicy` குறிப்பிடப்படாவிட்டால், இயல்பாக (default) `Delete` ஆகும்.

கையால் (manually) உருவாக்கப்பட்டு StorageClass மூலம் நிர்வகிக்கப்படும் PersistentVolumes கள் உருவாக்கும்போது ஒதுக்கப்பட்ட எந்த மீட்பு கொள்கையையும் வைத்திருக்கும்.

### தொகுதி விரிவாக்கலை அனுமதிக்கிறது (Allow Volume Expansion)

PersistentVolumes ஐ விரிவாக்க (expand) கட்டமைக்கலாம். `allowVolumeExpansion` வயலை `true` என்று அமைப்பதன் மூலம் தொகுதி வகைகளை விரிவாக்க அனுமதிக்கும்.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/no-provisioner
allowVolumeExpansion: true
```

இந்த அம்சம் தொகுதியை குறுக்குவதற்கு (shrinking) அனுமதிக்காது. PVC இன் `spec` வயலில் இருந்து அளவை அதிகரிக்க மட்டுமே பயன்படுத்தலாம்.

ஆதரிக்கப்படும் தொகுதி வகைகள்:

| தொகுதி வகை | Kubernetes பதிப்பு |
|------------|------------------|
| Azure File | 1.11 |
| CSI | 1.14 |
| EBS | 1.11 |
| GCE PD | 1.11 |
| Portworx | 1.11 |
| rbd | 1.11 |

### இணைப்பு விருப்பங்கள் (Mount Options)

StorageClass மூலம் மாறும் வகையில் உருவாக்கப்பட்ட PersistentVolumes கள் `mountOptions` வயலில் குறிப்பிட்டுள்ள இணைப்பு விருப்பங்களுடன் இணைக்கப்படும்.

ஒரு தொகுதி சொருகி இணைப்பு விருப்பங்களை ஆதரிக்கவில்லை என்றால், அவை புறக்கணிக்கப்படும். இந்த நிலையில் ஆவணம் அல்லது பிழை (error) வழங்கப்படாது.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
mountOptions:
  - debug
```

### தொகுதி பிணைப்பு முறை (Volume Binding Mode)

`volumeBindingMode` வயல் PersistentVolume வழங்கல் மற்றும் பிணைப்பு (binding) எப்போது நிகழ வேண்டும் என்பதை கட்டுப்படுத்துகிறது. அமைக்கப்படாதபோது, இயல்பாக `Immediate` முறை பயன்படுத்தப்படும்.

`Immediate` முறை என்பது PersistentVolumeClaim உருவாக்கப்பட்டவுடன் தொகுதி பிணைத்தல் மற்றும் மாறும் வழங்கல் நிகழும் என்று குறிக்கிறது. தொபாலஜி-கட்டுப்படுத்தப்பட்ட (topology-constrained) சேமிப்பக பின்தளங்களுக்கு (backends), PVC க்கு அணுகலற்ற (inaccessible) Node இல் Pod திட்டமிடப்படலாம்.

`WaitForFirstConsumer` முறை, PVC ஐ பயன்படுத்தும் முதல் Pod உருவாக்கப்படும் வரை PV வழங்கல் மற்றும் பிணைத்தலை தாமதப்படுத்தும். StorageClass ஐப் பயன்படுத்தும் Pod ஐ திட்டமிட்டவுடன் PV கள் Pod இன் திட்டமிடல் கட்டுப்பாடுகளால் (scheduling constraints) குறிப்பிடப்பட்டுள்ள topology க்கு ஏற்ப வழங்கப்படும்.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/gce-pd
volumeBindingMode: WaitForFirstConsumer
```

பின்வரும் தொகுதி சொருகிகள் `WaitForFirstConsumer` ஐ ஆதரிக்கின்றன:

- AWSElasticBlockStore
- GCEPersistentDisk
- AzureDisk
- குறிப்பிட்ட CSI சொருகிகள் (குறிப்பிட்ட CSI plugins) — தொடர்புடைய CSI ஆவணத்தை பாருங்கள்.

{{< note >}}
`WaitForFirstConsumer` ஐ பயன்படுத்தினால், Pod அல்லது PVC spec இல் `nodeName` வயலை வழங்க வேண்டாம். Node affinity க்கு `nodeSelector` பயன்படுத்தவும்.
{{< /note >}}

### அனுமதிக்கப்பட்ட topology கள் (Allowed Topologies)

`WaitForFirstConsumer` தொகுதி பிணைப்பு முறையை பயன்படுத்தும்போது, பெரும்பாலான சூழல்களில் தொகுதி வழங்கலை குறிப்பிட்ட topology க்கு கட்டுப்படுத்த வேண்டிய அவசியமில்லை. இருப்பினும், தேவைப்பட்டால், `allowedTopologies` குறிப்பிடப்படலாம்.

இந்த உதாரணம் வழங்கலை குறிப்பிட்ட zones க்கு மட்டும் கட்டுப்படுத்துவதை காண்பிக்கிறது:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
volumeBindingMode: WaitForFirstConsumer
allowedTopologies:
- matchLabelExpressions:
  - key: failure-domain.beta.kubernetes.io/zone
    values:
    - us-central-1a
    - us-central-1b
```

## இயல்பான StorageClass (Default StorageClass)

ஒரு கொத்தில் (cluster) ஒரு இயல்பான (default) StorageClass ஐ குறிப்பிடலாம், இதன்மூலம் StorageClass குறிப்பிடாத PersistentVolumeClaim கள் தானாகவே இந்த இயல்பான வகுப்பை பெறும்.

{{< note >}}
உங்கள் கொத்தில் இயல்பானதாக குறிக்கப்பட்ட ஒரே ஒரு StorageClass மட்டுமே இருக்க முயற்சிக்கவும். இல்லாவிட்டால் எதிர்பாராத நடத்தை ஏற்படலாம்.
{{< /note >}}

### நிர்வாகி கட்டமைப்பு (Administrator Configuration)

ஒரு StorageClass ஐ இயல்பானதாக குறிக்க `storageclass.kubernetes.io/is-default-class` என்ற annotation ஐ `"true"` என்று அமைக்கவும்:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

இரண்டு அல்லது அதிகமான StorageClass கள் இயல்பானதாக குறிக்கப்பட்டிருந்தால், StorageClass குறிப்பிடாத புதிய PVC கள் உருவாக்கத்தில் தோல்வியடையும்.

### PVC நடத்தை (PVC Behavior)

- PVC storageClassName குறிப்பிடவில்லை என்றால் மற்றும் ஒரு இயல்பான StorageClass உள்ளது என்றால்: PVC அந்த இயல்பான StorageClass ஐ பயன்படுத்தி பிணிக்கப்படும்.
- PVC `storageClassName: ""` (வெற்று சரம்) என்று குறிப்பிட்டிருந்தால்: PVC எப்போதும் StorageClass இல்லாத PV ஐ கோரும் — மாறும் வழங்கல் நடைபெறாது.

## அளவுருக்கள் (Parameters)

StorageClass கள் அதை சேர்ந்த வழங்குனருக்கு (provisioner) உரிய அளவுருக்களை வைத்திருக்கலாம். வழங்குனரைப் பொறுத்து வெவ்வேறு அளவுருக்கள் ஏற்றுக்கொள்ளப்படுகின்றன. உதாரணமாக, `type` என்ற அளவுரு மதிப்பு `io1` மற்றும் `iopsPerGB` என்ற அளவுரு EBS க்கு (AWS Elastic Block Store) உரியவை. ஒரு அளவுரு இல்லாத நிலையில் (omitted), சில இயல்பு மதிப்பு பயன்படுத்தப்படும்.

ஒரு StorageClass இல் அதிகபட்சம் 512 அளவுருக்கள் வரையறுக்கப்படலாம். அளவுருக்கள் மற்றும் அவற்றின் மதிப்புகளின் மொத்த நீளம் 256 KiB ஐ மீறக்கூடாது.

## AWS EBS உதாரணம்

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  iopsPerGB: "10"
  fsType: ext4
```

- `type`: AWS EBS தொகுதியின் வகை, `io1`, `gp2`, `sc1`, `st1` போன்றவை. இயல்பு மதிப்பு `gp2`.
- `iopsPerGB`: `io1` தொகுதிகளுக்கு மட்டும் பொருந்தும். GiB க்கு I/O செயல்பாடுகளின் (operations) எண்ணிக்கை.
- `fsType`: Kubernetes ஆல் ஆதரிக்கப்படும் கோப்பு முறைமை (file system) வகை. இயல்பு மதிப்பு `ext4`.
- `encrypted`: EBS தொகுதி குறியாக்கம் (encrypted) செய்யப்படும் என்பதை குறிக்கிறது.
- `kmsKeyId`: குறியாக்கத்திற்கு பயன்படுத்தப்படும் AWS Key Management Service விசையின் ARN.

{{< note >}}
`kubernetes.io/aws-ebs` என்ற in-tree வழங்குனர் பழமையானது (deprecated). `ebs.csi.aws.com` என்ற CSI வழங்குனரை பயன்படுத்துவது பரிந்துரைக்கப்படுகிறது.
{{< /note >}}

## GCE PD உதாரணம்

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  fstype: ext4
  replication-type: none
```

- `type`: Google Cloud Persistent Disk வகை, `pd-standard` அல்லது `pd-ssd`. இயல்பு மதிப்பு `pd-standard`.
- `zone` (deprecated): GCE zone. `zone` மற்றும் `zones` இரண்டும் குறிப்பிடப்படாவிட்டால், தொகுதிகள் சுற்றி வரும் (round-robin) முறையில் Kubernetes cluster Node கள் இருக்கும் எல்லா active zones இலும் வழங்கப்படும்.
- `zones` (deprecated): GCE zones இன் கமா-பிரிக்கப்பட்ட (comma-separated) பட்டியல்.
- `fstype`: `ext4` அல்லது `xfs`. இயல்பு மதிப்பு `ext4`.
- `replication-type`: `none` அல்லது `regional-pd`. இயல்பு மதிப்பு `none`.

`replication-type` ஐ `regional-pd` என்று அமைத்தால், PV ஒரு multi-zonal (regional) தொகுதியாக வழங்கப்படும். அந்த நிலையில் `allowedTopologies` இல் இரண்டு zones குறிப்பிட வேண்டும்:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: regionalpd-storageclass
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  replication-type: regional-pd
volumeBindingMode: WaitForFirstConsumer
allowedTopologies:
- matchLabelExpressions:
  - key: failure-domain.beta.kubernetes.io/zone
    values:
    - us-central1-a
    - us-central1-b
```

{{< note >}}
`kubernetes.io/gce-pd` என்ற in-tree வழங்குனர் பழமையானது (deprecated). `pd.csi.storage.gke.io` என்ற CSI வழங்குனரை பயன்படுத்துவது பரிந்துரைக்கப்படுகிறது.
{{< /note >}}

## உள்ளூர் தொகுதிகள் (Local Volumes)

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

உள்ளூர் தொகுதிகள் (Local volumes) தற்போது மாறும் வழங்கலை (dynamic provisioning) ஆதரிக்கவில்லை. எனினும், Pod திட்டமிடல் (scheduling) வரை தொகுதி பிணிப்பை (volume binding) தாமதப்படுத்தும் வகையில் `WaitForFirstConsumer` தொகுதி பிணைப்பு முறை பயன்படுத்தப்பட வேண்டும். இது கொத்தில் (cluster) Node தேர்வை அனுமதிக்கிறது மற்றும் Node இல் கிடைக்கக்கூடிய உள்ளூர் சேமிப்பகத்துடன் PVC ஐ பிணிக்க (bind) உதவுகிறது.

Node affinity க்கு கீழ்க்கண்ட PersistentVolume உதாரணத்தில் காண்பிக்கப்பட்டுள்ளவாறு கட்டமைக்கலாம்:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

{{< note >}}
உள்ளூர் PersistentVolume ஐ பயன்படுத்துவதற்கு `nodeAffinity` வயல் தேவை. உள்ளூர் தொகுதி (local volume) எந்த Node இல் இருக்கிறது என்று Kubernetes scheduler க்கு தெரியப்படுத்த இது அவசியமாகும்.
{{< /note >}}

`volumeMode` ஐ `Block` என்று அமைத்தால் (இயல்பான `Filesystem` க்கு பதிலாக), உள்ளூர் தொகுதியை வடிவமைக்கப்படாத raw block சாதனமாக (device) வெளிப்படுத்தலாம்.

## அடுத்து என்ன (What's Next)

- [நிலையான தொகுதி (PersistentVolume) வகைகள்](/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes) பற்றி மேலும் அறியுங்கள்.
- [StorageClass API reference](/docs/reference/kubernetes-api/config-and-storage-resources/storage-class-v1/) ஐப் பாருங்கள்.
- [Dynamic Volume Provisioning](/docs/concepts/storage/dynamic-provisioning/) வடிவமைப்பு ஆவணத்தை படியுங்கள்.
