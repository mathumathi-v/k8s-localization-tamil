---
title: தொகுதிகள் (Volumes)
content_type: concept
weight: 10
---

<!-- overview -->

கொள்கலனில் (Container) உள்ள வட்டு சேமிப்பகம் தற்காலிகமானது. ஒரு கொள்கலன் செயலிழந்து மறுதொடக்கம் செய்யப்படும்போது, `kubelet` அந்தக் கொள்கலனை சுத்தமான நிலையில் மீண்டும் தொடங்குகிறது; அதாவது, கொள்கலன் வாழ்நாளில் எழுதப்பட்ட எந்தத் தரவும் இழக்கப்படும்.

ஒரு Pod (போட்) இல் இயங்கும் பல கொள்கலன்களுக்கு இடையே தரவைப் பகிர வேண்டிய தேவையும் அடிக்கடி ஏற்படுகிறது. Kubernetes (குபர்நெட்டஸ்) Volume (தொகுதி) என்ற கருத்து இந்த இரண்டு சிக்கல்களையும் தீர்க்கிறது.

Docker-இலும் தொகுதிகளின் கருத்து உள்ளது, ஆனால் அது குபர்நெட்டஸ் தொகுதிகளை விட சற்று தளர்வான கட்டுப்பாடுகளை கொண்டுள்ளது. Docker-இல், ஒரு தொகுதி என்பது வெறுமனே வட்டில் உள்ள ஒரு கோப்பகம் அல்லது வேறு ஒரு கொள்கலனில் உள்ளது. Docker அந்தத் தொகுதிகளை நிர்வகிக்கிறது, ஆனால் Docker தொகுதி நிர்வாகம் மட்டுப்படுத்தப்பட்டதாக உள்ளது.

Kubernetes பல வகையான தொகுதிகளை ஆதரிக்கிறது. ஒரு Pod-க்கு ஒரே நேரத்தில் எத்தனை தொகுதிகள் வேண்டுமானாலும் பயன்படுத்தலாம். தற்காலிக (ephemeral) தொகுதிகளின் வாழ்நாள் Pod-ஓடு சேர்ந்து முடியும், ஆனால் நிலையான (persistent) தொகுதிகள் Pod-ஐ விட அதிக காலம் இருக்கும். ஒரு Pod நிறுத்தப்படும்போது, Kubernetes நிலையான தொகுதிகளை அழிக்காது; தற்காலிக தொகுதிகளை அழிக்கும். எந்த வகை தொகுதியாக இருந்தாலும், Pod இயங்கும் வரை தரவு பாதுகாக்கப்படும்.

ஒரு தொகுதியின் மூலத்தில், அந்த தொகுதிக்கு பின்னணியாக இருக்கும் கோப்பகம் என்ன என்று Kubernetes நிர்ணயிக்கிறது. காரணம்: நீட்டிப்பு வகைகள் உள்ளிட்ட பல வழிமுறைகள் (mechanisms) உள்ளன.

தொகுதிகளைப் பயன்படுத்த, `.spec.volumes`-இல் Pod-க்கு வழங்கும் தொகுதிகளை அறிவிக்கவும், `.spec.containers[*].volumeMounts`-இல் அந்தத் தொகுதிகளை கொள்கலன்களில் எங்கு ஏற்ற வேண்டும் என்று அறிவிக்கவும்.

ஒரு கொள்கலனில் உள்ள செயல்முறை, கொள்கலன் படத்தின் (image) மூல உள்ளடக்கங்கள் மற்றும் கொள்கலனுக்குள் ஏற்றப்பட்ட தொகுதிகள் ஆகியவற்றால் உருவாகும் ஒரு கோப்பமைப்பு பார்வையை காண்கிறது. தொகுதி, கோப்பமைப்பில் குறிப்பிட்ட இடத்தில் (`mountPath`) ஏற்றப்படுகிறது.

<!-- body -->

## தொகுதிகள் எவ்வாறு செயல்படுகின்றன (How Volumes Work)

Docker தொகுதிகளோடு ஒப்பிடும்போது, Kubernetes தொகுதிகளுக்கு வெளிப்படையான வாழ்நாள் (lifetime) உண்டு — அந்த தொகுதியை உள்ளடக்கிய Pod-ஐப் போன்றே. இதன் விளைவாக, ஒரு தொகுதி, Pod-இல் இயங்கும் எல்லா கொள்கலன்களையும் விட அதிக காலம் இயங்குகிறது, மேலும் கொள்கலன் மறுதொடக்கம் செய்யப்படும்போதும் தரவு தொடர்ச்சியாக இருக்கும். Pod நிறுத்தப்படும்போது, அந்த Pod-இல் உள்ள எல்லா தொகுதிகளும் அழிக்கப்படும்.

Kubernetes, தொகுதி வகையை ஆதாரத்தைப் (backend) பொறுத்து கையாளுகிறது:

- `configMap`, `secret`, `projected` போன்ற தொகுதிகள் Kubernetes API-இலிருந்து தரவை பெறுகின்றன.
- `emptyDir`, `hostPath` போன்ற தொகுதிகள் Node (நோட்) இல் உள்ள வளங்களிலிருந்து உருவாகின்றன.
- `nfs`, `csi` போன்ற தொகுதிகள் வெளிப்புற சேமிப்பு அமைப்புகளுடன் இணைக்கின்றன.

## தொகுதி வகைகள் (Types of Volumes)

Kubernetes பல வகையான தொகுதிகளை ஆதரிக்கிறது.

### configMap

`configMap` தொகுதி, ஒரு ConfigMap-இல் சேமிக்கப்பட்ட தரவை ஒரு Pod-இல் கோப்புகளாக ஏற்றுவதற்கான வழியை வழங்குகிறது. ConfigMap-இல் சேமிக்கப்பட்ட தரவை, கொள்கலன் பயன்படுத்தும் உள்ளமைவு (Configuration) கோப்புகளாக நேரடியாகப் பயன்படுத்தலாம்.

{{< note >}}
ஒரு ConfigMap-ஐப் பயன்படுத்துவதற்கு முன்பு அதை உருவாக்கியிருக்க வேண்டும்.
{{< /note >}}

ஒரு ConfigMap எப்போதும் `readOnly` வகையாக ஏற்றப்படுகிறது.

`configMap` தொகுதியை எவ்வாறு குறிப்பிடுவது என்பதற்கான எடுத்துக்காட்டு:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

மேற்கண்ட எடுத்துக்காட்டில், `log-config` என்ற ConfigMap ஒரு தொகுதியாக ஏற்றப்படுகிறது, மேலும் `log_level` என்ற key-இல் சேமிக்கப்பட்ட உள்ளடக்கம் கொள்கலனில் `/etc/config/log_level` என்ற பாதையில் ஏற்றப்படுகிறது.

{{< note >}}
ConfigMap-ஐ தொகுதியாக பயன்படுத்த, `subPath` தொகுதி ஏற்றத்தை (mount) பயன்படுத்தினால், ConfigMap புதுப்பிப்புகள் தானாகப் பிரதிபலிக்காது.
{{< /note >}}

### emptyDir

`emptyDir` தொகுதி, Pod ஒரு Node-இல் நியமிக்கப்படும் போது (assigned) முதலில் உருவாக்கப்படுகிறது, மேலும் அந்த Pod அந்த Node-இல் இயங்கும் வரை தொடர்ந்து இருக்கும். பெயர் குறிப்பிடுவதுபோல், தொகுதி ஆரம்பத்தில் காலியாக இருக்கும். Pod-இல் உள்ள எல்லா கொள்கலன்களும் `emptyDir` தொகுதியில் உள்ள அதே கோப்புகளை படிக்கவும் எழுதவும் முடியும், அந்தத் தொகுதி ஒவ்வொரு கொள்கலனில் ஒரே அல்லது வெவ்வேறு பாதைகளில் ஏற்றப்பட்டிருக்கலாம். **Pod நீக்கப்படும்போது, `emptyDir` தொகுதியில் உள்ள தரவு நிரந்தரமாக அழிக்கப்படும்.**

{{< note >}}
ஒரு கொள்கலன் செயலிழந்தாலும் `emptyDir` தொகுதியில் உள்ள தரவு இழக்கப்படாது. கொள்கலன் செயலிழப்பு Pod-ஐ Node-இலிருந்து நீக்காது.
{{< /note >}}

`emptyDir`-க்கான சில பயன்பாடுகள்:
- வட்டு அடிப்படையிலான இணைப்பு-தொகுப்பு (merge sort) போன்ற ஸ்கிராட்ச் (scratch) இடம்
- நீண்ட கணக்கீட்டிலிருந்து செயலிழப்பிலிருந்து மீட்க தரவு சேமித்தல் (checkpointing)
- ஒரு உள்ளடக்க-மேலாண்மை (content-manager) கொள்கலன் தரவை நிரப்பி, ஒரு வெப்-சர்வர் (webserver) கொள்கலன் தரவை வழங்குதல்

`emptyDir.medium` புலம் கட்டுப்படுத்துகிறது `emptyDir` எங்கு சேமிக்கப்படுகிறது என்று. இயல்பாக, `emptyDir` தொகுதிகள் Node-இல் பயன்படுத்தப்படும் எந்த ஊடகத்திலும் (medium) சேமிக்கப்படும்: வட்டு, SSD அல்லது நெட்வொர்க் சேமிப்பகம். `emptyDir.medium` புலத்தை `"Memory"` என்று அமைத்தால், Kubernetes-க்கு `tmpfs` (RAM-ஆல் ஆதரிக்கப்பட்ட கோப்பமைப்பு) ஏற்றுமாறு கூறுகிறது. `tmpfs` மிகவும் வேகமானது, ஆனால் வட்டைப் போல அல்லாமல் Node மறுதொடக்கம் செய்யப்படும்போது அழிந்துவிடும், மேலும் நீங்கள் எழுதிய கோப்புகள் கொள்கலனின் நினைவக வரம்புக்கு எதிராக கணக்கிடப்படும்.

`emptyDir.sizeLimit` புலத்தை அமைப்பதன் மூலம் ஒரு `emptyDir` தொகுதியில் பயன்படுத்தக்கூடிய இடத்தை வரம்பிட முடியும்.

`emptyDir`-ஐ எவ்வாறு பயன்படுத்துவது என்பதற்கான எடுத்துக்காட்டு:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir:
      sizeLimit: 500Mi
```

### hostPath

{{< warning >}}
`hostPath` தொகுதிகள் பல பாதுகாப்பு அபாயங்களை ஏற்படுத்துகின்றன. சாத்தியமான இடங்களில் `hostPath` பயன்படுத்துவதை தவிர்ப்பது நல்லது. `hostPath` தொகுதியைப் பயன்படுத்தியே ஆக வேண்டும் என்றால், அதன் நோக்கத்திற்கு தேவையான Files அல்லது Directory மட்டுமே ஏற்றவும், `ReadOnly` வகையிலேயே ஏற்றவும்.
{{< /warning >}}

ஒரு `hostPath` தொகுதி, Node-இன் கோப்பமைப்பில் உள்ள ஒரு கோப்பு அல்லது கோப்பகத்தை Pod-இல் ஏற்றுகிறது. இது பெரும்பாலான Pod-களுக்கு தேவையில்லை, ஆனால் சில சிறப்பு பயன்பாட்டு நிகழ்வுகளுக்கு (use cases) வலிமையான வாய்ப்பை வழங்குகிறது.

எடுத்துக்காட்டாக, `hostPath`-க்கான சில பயன்பாடுகள்:
- Docker உள்நாட்டு (internals) அணுகல் தேவைப்படும் கொள்கலன் இயக்கம்: `/var/lib/docker` என்ற `hostPath` பயன்படுத்தவும்
- ஒரு கொள்கலனில் cAdvisor இயக்குவதற்கு: `/sys` என்ற `hostPath` பயன்படுத்தவும்

#### hostPath configuration (hostPath உள்ளமைவு) {#hostpath-configuration}

ஒரு `hostPath` தொகுதியை ஒரு `path` கொண்ட Pod-இல் கட்டமைப்பதோடு, விரும்பினால் ஒரு `type`-ஐயும் குறிப்பிடலாம்.

`type` புலத்தின் ஆதரிக்கப்படும் மதிப்புகள்:

| மதிப்பு (Value) | நடத்தை (Behavior) |
|:------|:---------|
| `""` | காலி சரம் (இயல்புநிலை) என்பது பின்தங்கிய இணக்கத்தன்மையை (backward compatibility) குறிக்கிறது; `hostPath` தொகுதியை ஏற்றுவதற்கு முன்பு எந்தச் சரிபார்ப்பும் செய்யப்படாது. |
| `DirectoryOrCreate` | கொடுக்கப்பட்ட பாதையில் எதுவும் இல்லை என்றால், 0755 அனுமதிகளுடன் (permissions) காலி கோப்பகம் தேவைக்கேற்ப உருவாக்கப்படும், kubelet-ஐப் போன்ற அதே குழு மற்றும் உரிமையாளரோடு. |
| `Directory` | கொடுக்கப்பட்ட பாதையில் கோப்பகம் இருக்க வேண்டும். |
| `FileOrCreate` | கொடுக்கப்பட்ட பாதையில் எதுவும் இல்லை என்றால், 0644 அனுமதிகளுடன் காலி கோப்பு தேவைக்கேற்ப உருவாக்கப்படும், kubelet-ஐப் போன்ற அதே குழு மற்றும் உரிமையாளரோடு. |
| `File` | கொடுக்கப்பட்ட பாதையில் கோப்பு இருக்க வேண்டும். |
| `Socket` | கொடுக்கப்பட்ட பாதையில் UNIX socket இருக்க வேண்டும். |
| `CharDevice` | *(Linux nodes மட்டும்)* கொடுக்கப்பட்ட பாதையில் character device இருக்க வேண்டும். |
| `BlockDevice` | *(Linux nodes மட்டும்)* கொடுக்கப்பட்ட பாதையில் block device இருக்க வேண்டும். |

{{< caution >}}
`FileOrCreate` வகை கோப்பின் பெற்றோர் கோப்பகத்தை உருவாக்காது. ஏற்றப்பட்ட கோப்பின் பெற்றோர் கோப்பகம் இல்லை என்றால், Pod தொடங்குவதில் தோல்வியடையும். இந்த வகை செயல்படுவதை உறுதி செய்ய, `DirectoryOrCreate` உள்ளமைவைப் பயன்படுத்தி அந்த கோப்பகத்தை வெவ்வேறு `hostPath` தொகுதியில் ஏற்ற முயற்சிக்கலாம்.
{{< /caution >}}

#### hostPath உதாரண உள்ளமைவு (hostPath example configuration)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # directory location on host
      path: /data
      # this field is optional
      type: Directory
```

#### hostPath FileOrCreate உதாரணம் (hostPath FileOrCreate example)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  os: { name: linux }
  nodeSelector:
    kubernetes.io/os: linux
  containers:
  - name: test-webserver
    image: registry.k8s.io/test-webserver:latest
    volumeMounts:
    - mountPath: /var/local/aaa
      name: mydir
    - mountPath: /var/local/aaa/1.txt
      name: myfile
  volumes:
  - name: mydir
    hostPath:
      # Ensure the file directory is created.
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```

### local

ஒரு `local` தொகுதி, வட்டு, பகிர்வு (partition), அல்லது கோப்பகம் போன்ற ஏற்றப்பட்ட (mounted) உள்ளூர் சேமிப்பு சாதனத்தை குறிக்கிறது.

`local` தொகுதிகள் நிலையான (static) வழியில் மட்டுமே உருவாக்கப்படலாம். Dynamic provisioning ஆதரிக்கப்படவில்லை.

`hostPath` தொகுதிகளோடு ஒப்பிடும்போது, `local` தொகுதிகள் Pod-ஐ கைமுறையாக ஒரு குறிப்பிட்ட Node-இல் திட்டமிட (schedule) வேண்டியதில்லாமல், system-aware வகையில் Node-இன் அனைத்து சேமிப்பு வரம்புகளையும் (capacity) கட்டுப்படுத்துகின்றன.

ஆனால் `local` தொகுதிகள் இன்னும் Node-இன் இடைவருகை (availability) ஐ சார்ந்திருக்கும், மேலும் எல்லா பயன்பாட்டுகளுக்கும் ஏற்றதல்ல. ஒரு Node செயலிழந்தால், `local` தொகுதி அணுகல் இல்லாமல் போகும், Pod-ஐ இயக்க முடியாமல் போகும். இந்த `local` தொகுதியை பயன்படுத்தும் பயன்பாட்டுக்கு இந்த குறைந்த கிடைக்கும் தன்மையை (reduced availability) தாங்கும் ஆற்றல் இருக்க வேண்டும், மேலும் தரவு இழப்பின் சாத்தியத்தையும் கையாள முடியும் வேண்டும்.

கீழே ஒரு `local` தொகுதி மற்றும் `nodeAffinity`-ஐ பயன்படுத்தும் PersistentVolume spec-க்கான எடுத்துக்காட்டு:

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

`local` தொகுதிகளைப் பயன்படுத்தும்போது PersistentVolume `nodeAffinity` அவசியம். Kubernetes திட்டமிடுபவர் (scheduler) `nodeAffinity`-ஐப் பயன்படுத்தி சரியான Node-இல் Pod-களை திட்டமிடுகிறது.

PersistentVolume `volumeMode`-ஐ `Block`-க்கு அமைக்கலாம் (இயல்பான `Filesystem`-க்கு பதிலாக) `local` தொகுதியை raw block device-ஆக அணுக.

`local` தொகுதிகளைப் பயன்படுத்தும்போது, `WaitForFirstConsumer` volumeBindingMode-ஐ கொண்ட StorageClass அமைக்க பரிந்துரைக்கப்படுகிறது.

### nfs

ஒரு `nfs` தொகுதி, NFS (Network File System)-ஐ Pod-இல் ஏற்ற அனுமதிக்கிறது. Pod நீக்கப்படும்போது `nfs` தொகுதியின் உள்ளடக்கம் பாதுகாக்கப்படும், தொகுதி மட்டுமே அன்மவிக்கப்படும் (unmounted). இதன் பொருள், ஒரு NFS தொகுதியில் தரவை முன்னமே நிரப்பலாம், மேலும் அந்தத் தரவை Pod-களுக்கு இடையே பகிர்ந்து கொள்ளலாம். ஒரே நேரத்தில் பல எழுத்தாளர்களால் (writers) NFS ஏற்றப்படலாம்.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /my-nfs-data
      name: test-volume
  volumes:
  - name: test-volume
    nfs:
      server: my-nfs-server.example.com
      path: /my-nfs-volume
      readOnly: true
```

{{< note >}}
NFS சர்வரை (server) நீங்கள் தொடங்குவதற்கு முன், NFS சர்வர் இயங்கி, பகிர்வு ஏற்றுமதி செய்யப்பட்டிருக்க வேண்டும்.
{{< /note >}}

### persistentVolumeClaim

ஒரு `persistentVolumeClaim` தொகுதி, ஒரு PersistentVolumeClaim (PVC)-ஐ Pod-இல் ஏற்றுவதற்கு பயன்படுகிறது. PersistentVolumeClaim-கள், பயனர்கள் குறிப்பிட்ட Cloud சூழலின் விவரங்களை அறியாமல் நிலையான சேமிப்பகத்தை (durable storage) கோருவதற்கான ஒரு வழியாகும்.

PersistentVolume மற்றும் PersistentVolumeClaim பற்றி மேலும் தகவல்களுக்கு, [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) பக்கத்தைப் பார்க்கவும்.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### projected

ஒரு `projected` தொகுதி, பல ஆதாரங்களிலிருந்து பல தொகுதிகளை ஒரே கோப்பகத்தில் இணைக்கிறது (maps).

கீழ்க்கண்ட வகைகள் projected தொகுதியில் பயன்படுத்தலாம்:

* `secret`
* `downwardAPI`
* `configMap`
* `serviceAccountToken`
* `clusterTrustBundle`

அனைத்து மூலங்களும் Pod-ஐப் போன்றே அதே Namespace (பெயரிடல் வெளி)-இல் இருக்க வேண்டும். மேலும் தகவல்களுக்கு [projected volumes](/docs/concepts/storage/projected-volumes) பார்க்கவும்.

கீழே secret மற்றும் downwardAPI-ஐ projected தொகுதியில் பயன்படுத்துவதற்கான எடுத்துக்காட்டு:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox:1.28
    command: ["sh", "-c", "cat /all-in-one/issue"]
    volumeMounts:
    - name: all-in-one
      mountPath: "/all-in-one"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - downwardAPI:
          items:
            - path: "labels"
              fieldRef:
                fieldPath: metadata.labels
            - path: "cpu_limit"
              resourceFieldRef:
                containerName: container-test
                resource: limits.cpu
      - configMap:
          name: myconfigmap
          items:
            - key: config
              path: my-group/my-config
```

### secret

`secret` தொகுதி, கடவுச்சொற்கள் (passwords) போன்ற முக்கியமான தகவல்களை Pod-களுக்கு அனுப்ப பயன்படுகிறது. Kubernetes API-இல் secrets சேமிக்கலாம், பின் அவற்றை Kubernetes-ஐ நேரடியாக சார்ந்திராமல் Pod-களில் கோப்புகளாக ஏற்றலாம்.

`secret` தொகுதிகள் `tmpfs`-ஆல் (RAM-ஆல் ஆதரிக்கப்பட்ட கோப்பமைப்பு) ஆதரிக்கப்படுகின்றன, எனவே secrets என்றும் non-volatile storage-ல் எழுதப்படுவதில்லை.

{{< note >}}
ஒரு Secret-ஐப் பயன்படுத்துவதற்கு முன்பு அதை உருவாக்க வேண்டும்.
{{< /note >}}

{{< note >}}
ஒரு Secret-ஐ `subPath` தொகுதி ஏற்றமாக பயன்படுத்தும் கொள்கலன் Secret புதுப்பிப்புகளை தானாகப் பெறாது.
{{< /note >}}

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
    secret:
      secretName: mysecret
      optional: false # default setting; "mysecret" must already exist
```

---

## subPath பயன்படுத்துதல் (Using subPath)

சில நேரங்களில், ஒரே தொகுதியை பல பயன்பாட்டு நோக்கங்களுக்கு (uses) ஒரு Pod-இல் பகிர்வது பயனுள்ளதாக இருக்கும். `volumeMounts.subPath` property-ஐப் பயன்படுத்தி அந்தத் தொகுதியில் ஒரு துணைப்பாதையை (sub-path) குறிப்பிடலாம், அதாவது மூல (root) பாதைக்கு பதிலாக.

கீழே LAMP (Linux, Apache, MySQL, PHP) மடித்தலை ஒரே, பகிரப்பட்ட தொகுதியில் கொள்கலனில் இயக்குவதற்கான Pod-இன் எடுத்துக்காட்டு. HTML உள்ளடக்கங்கள் `html` கோப்பகத்தில் இணைக்கப்படுகின்றன, மேலும் தரவுத்தளங்கள் `mysql` கோப்பகத்தில் சேமிக்கப்படும்:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### சூழல் மாறிகளிலிருந்து subPath பயன்படுத்துதல் (Using subPath with expanded environment variables)

{{< feature-state feature_gate_name="VolumeSubpathEnvExpansion" >}}

`subPathExpr` புலத்தைப் பயன்படுத்தி Downward API சூழல் மாறிகளிலிருந்து (environment variables) `subPath` கோப்பக பெயர்களை உருவாக்கலாம். `subPath` மற்றும் `subPathExpr` properties ஒன்றோடொன்று பிரத்யேகமானவை (mutually exclusive).

இந்த எடுத்துக்காட்டில், Pod `subPathExpr`-ஐப் பயன்படுத்தி `hostPath` தொகுதி `/var/log/pods`-இல் `pod1` என்ற கோப்பகத்தை உருவாக்குகிறது. `hostPath` தொகுதி `downwardAPI`-இலிருந்து Pod பெயரை பெறுகிறது. `hostPath` கோப்பகம் `/var/log/pods/pod1`-ஐ கொள்கலனில் `/logs`-ல் ஏற்றுகிறது:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox:1.28
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      # The variable expansion uses round brackets (not curly brackets).
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

---

## ஏற்றல் பரவல் (Mount Propagation)

ஏற்றல் பரவல், ஒரு கொள்கலன் மூலம் அல்லது ஒரு Pod மூலம் அல்லது Node-இல் உள்ள மற்ற கொள்கலன்கள் அல்லது Pod-களுக்கு (அல்லது போன்ற Node-களுக்கு கூட) ஏற்றங்களை (mounts) பகிர்வதை அனுமதிக்கிறது.

தொகுதிக்கான ஏற்றல் பரவலை `Container.volumeMounts`-இல் `mountPropagation` புலம் கட்டுப்படுத்துகிறது. அதன் மதிப்புகள் பின்வருமாறு:

`None`
: இந்தத் தொகுதி ஏற்றம் host-இலிருந்து அந்த தொகுதிக்குள் ஏற்றப்பட்ட எந்த அடுத்தடுத்த ஏற்றங்களையும் பெறாது, மேலும் container process-ஆல் உருவாக்கப்பட்ட எந்த ஏற்றங்களும் host-க்கு தெரியாது. இது Linux kernel ஆவணப்படி `private` ஏற்றல் பரவலுக்கு சமம். இதுவே இயல்புநிலை (default) வகை.

`HostToContainer`
: இந்தத் தொகுதி ஏற்றம், அந்த தொகுதிக்குள் அல்லது அதன் துணை கோப்பகங்களில் ஏற்றப்பட்ட எல்லா ஏற்றங்களையும் பெறும். வேறுவிதமாகக் கூறினால், host ஒரு கூடுதல் ஏற்றத்தை தொகுதி ஏற்றத்திற்கு கீழே செய்தால், கொள்கலன் அதை காண்பது Linux kernel ஆவணப்படி `rslave` ஏற்றல் பரவலுக்கு சமம்.

`Bidirectional`
: இந்தத் தொகுதி ஏற்றம் `HostToContainer`-ஐப் போலவே செயல்படுகிறது. கூடுதலாக, கொள்கலனால் உருவாக்கப்பட்ட எல்லா தொகுதி ஏற்றங்களும் எல்லா Pod-களிலும் அதே தொகுதியை பயன்படுத்தும் எல்லா கொள்கலன்களிலும் மற்றும் host-லிலும் திரும்பப் பரவும். இது Linux kernel ஆவணப்படி `rshared` ஏற்றல் பரவலுக்கு சமம். `Bidirectional` ஏற்றல் பரவல் ஆபத்தானது. Host இயக்க முறைமை (operating system) சேதமடைவதற்கு வழிவகுக்கலாம், எனவே privileged கொள்கலன்களில் மட்டுமே அனுமதிக்கப்படுகிறது. Linux kernel நடத்தையை நன்கு புரிந்துகொள்வது மிகவும் பரிந்துரைக்கப்படுகிறது.

{{< note >}}
`Bidirectional` ஏற்றல் பரவல் கொண்ட Pod-கள் நன்கு செயல்படுவதற்கு, கொள்கலன் runtime `MountFlags=shared`-ஐ ஆதரிக்க வேண்டும்.
{{< /note >}}

---

## படிக்கமட்டும் ஏற்றங்கள் (Read-only mounts)

அனைத்து தொகுதி ஏற்றங்களையும் படிக்கமட்டுமாக (read-only) செய்வது, Pod அல்லது தனிப்பட்ட கொள்கலன்களுக்கான பாதுகாப்பை மேம்படுத்தும்.

எல்லா தொகுதி ஏற்றங்களையும் படிக்கமட்டும் தன்மையில் கட்டாயமாக்க `.spec.containers[*].volumeMounts[*].readOnly`-ஐ `true`-க்கு அமைக்கலாம்.

ஒரு Pod இன் அனைத்து தொகுதி ஏற்றங்களையும் படிக்கமட்டும் வகையில் அமைக்க `.spec.containers[*].securityContext.readOnlyRootFilesystem: true` ஐயும் அமைக்கலாம்.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: readonly-pod
spec:
  containers:
    - name: mycontainer
      image: nginx
      volumeMounts:
        - name: myvolume
          mountPath: /data
          readOnly: true
  volumes:
    - name: myvolume
      emptyDir: {}
```

---

## CSI தொகுதிகள் (CSI Volumes)

CSI என்பது Container Storage Interface-இன் சுருக்கமாகும். CSI, third-party storage vendors-க்கு Kubernetes-க்கான custom storage plugins-ஐ உருவாக்க அனுமதிக்கும் ஒரு நிலையான இடைமுகம் (standard interface).

CSI தொகுதிகளை இரண்டு வழிகளில் Pods-இல் பயன்படுத்தலாம்:
- PersistentVolumeClaim மூலம்
- நேரடி inline CSI ephemeral volumes மூலம்

CSI நிலையான (persistent) தொகுதிகளை ஆதரிக்கிறது, மேலும் தற்காலிக (ephemeral) inline தொகுதிகளையும் ஆதரிக்கிறது (CSI Ephemeral Volumes feature gate மூலம்).

CSI தொகுதிகளை `csi` தொகுதி வகையின் மூலம் கட்டமைக்கலாம்:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox:1.28
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
          foo: bar
```

### CSI Raw Block Volume ஆதரவு (CSI raw block volume support)

External CSI drivers can, optionally, enable raw block volume support. Block volumes-ஐ Pods-இல் ஏற்ற `volumeMode: Block`-ஐ PersistentVolumeClaim-இல் குறிப்பிடலாம்.

### CSI Ephemeral Volumes

{{< feature-state feature_gate_name="CSIInlineVolume" >}}

CSI ephemeral volumes-ஐ Pod spec-இல் inline-ஆக குறிப்பிடலாம். இவை தற்காலிகமானவை, Pod-ஓடு சேர்ந்து உருவாகி அழியும். Storage capacity tracking-க்கு ephemeral CSI volumes-ஐ அனுமதிப் பட்டியலில் (allowlist) சேர்க்க வேண்டியிருக்கும்.

CSI drivers பற்றி மேலும் தகவல்களுக்கு [CSI drivers documentation](https://kubernetes-csi.github.io/docs/) பார்க்கவும்.

---

## அடுத்தது என்ன (What's next)

* [Persistent Volumes](/docs/concepts/storage/persistent-volumes/) பற்றி மேலும் அறிக.
* [Projected Volumes](/docs/concepts/storage/projected-volumes/) பற்றி மேலும் அறிக.
* தொகுதிகள் மீதான [Kubernetes Storage Overview](https://kubernetes.io/docs/concepts/storage/) பார்க்கவும்.
* [Configure a Pod to Use a Volume for Storage](/docs/tasks/configure-pod-container/configure-volume-storage/) பயிற்சிகளைப் பாருங்கள்.
* [Configure a Pod to Use a PersistentVolume for Storage](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/) பயிற்சிகளைப் பாருங்கள்.
* [Storage Classes](/docs/concepts/storage/storage-classes/) ஆவணத்தைப் பார்க்கவும்.
* [Volume Snapshots](/docs/concepts/storage/volume-snapshots/) பற்றி மேலும் அறிக.
* [Volume Cloning](/docs/concepts/storage/volume-pvc-datasource/) பற்றி மேலும் அறிக.
* [CSI Drivers list](https://kubernetes-csi.github.io/docs/drivers.html) பார்க்கவும்.
