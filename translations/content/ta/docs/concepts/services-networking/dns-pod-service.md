---
reviewers:
- thockin
- bowei
title: சேவைகள் மற்றும் Pod-களுக்கான DNS
content_type: concept
weight: 20
description: >-
  உங்கள் கொத்தில் (cluster) இயங்கும் பணிச்சுமைகள் (workloads) எவ்வாறு
  ஒன்றையொன்று DNS மூலம் கண்டறியலாம் என்பதை இந்த பக்கம் விளக்குகிறது.
---

<!-- overview -->

Kubernetes, Service-களுக்கும் Pod-களுக்கும் தானாகவே DNS பதிவுகளை (records) உருவாக்குகிறது.
IP முகவரிகளுக்குப் பதிலாக DNS பெயர்களைப் பயன்படுத்தி Service-களை அணுகலாம்.

<!-- body -->

## அறிமுகம் {#introduction}

Kubernetes, DNS-மூலம் சேவை கண்டறிதலை (service discovery) வழங்க DNS கொத்துக்கு (cluster)
ஒரு DNS சேவையை (Service) திட்டமிட்டு இயக்குகிறது. `kubelet`, ஒவ்வொரு Pod-க்கும்
DNS சேவையைப் பயன்படுத்தும் வகையில் `/etc/resolv.conf` கோப்பை அமைக்கிறது.

CoreDNS என்பது இயல்புநிலை DNS சேவையாகும் (kube-dns என்ற பழைய பெயரிலும் அறியப்படும்).

## DNS வினவல்கள் எவ்வாறு தீர்க்கப்படுகின்றன {#how-dns-resolution-works}

ஒரு Pod-ல் இயங்கும் ஒவ்வொரு கொள்கலனும் (container) அதன் DNS தீர்மானத்திற்கு (DNS
resolution) `/etc/resolv.conf` கோப்பை நம்பியிருக்கிறது. `kubelet` இந்த கோப்பை
இயல்புநிலையாக பின்வருமாறு அமைக்கிறது:

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

`search` வரியில் உள்ள பெயரிடல் வெளி (Namespace) மாறுபடும் — இது அந்த Pod அமைந்துள்ள
பெயரிடல் வெளியைப் பொறுத்தது.

### பெயரிடல் வெளி அடிப்படையிலான DNS தீர்மானம் {#namespaces-of-services}

DNS வினவல்கள் அவற்றை அனுப்பும் Pod-இன் பெயரிடல் வெளியைப் பொறுத்து விரிவடைகின்றன.
`test` என்ற பெயரிடல் வெளியில் இயங்கும் ஒரு Pod, `data` என்ற Service-ஐ வினவினால்,
`test` பெயரிடல் வெளியில் உள்ள `data` Service-க்கான DNS கிடைக்கும்.

`prod` பெயரிடல் வெளியில் உள்ள ஒரு Service-ஐ அணுக, `data.prod` என்று வினவ வேண்டும்.

DNS வினவல்களை விரிவாக்க `search` பட்டியல் பயன்படுகிறது. எடுத்துக்காட்டாக, `test`
பெயரிடல் வெளியில் உள்ள ஒரு Pod `data.prod` என்று வினவும்போது,
`data.prod.svc.cluster.local` என்று தீர்மானிக்கப்படும்.

## Service-களுக்கான DNS {#dns-for-services}

### A/AAAA பதிவுகள் {#a-aaaa-records}

சாதாரண (headless அல்லாத) Service-கள் பின்வரும் வடிவத்தில் DNS பெயரைப் பெறுகின்றன:

```
my-svc.my-namespace.svc.cluster-domain.example
```

இந்த பெயர், Service-இன் cluster IP-க்கு தீர்மானிக்கப்படும்.

"Headless" Service-களும் (ClusterIP இல்லாமல்) அதே வடிவத்தில் DNS பெயரைப் பெறுகின்றன,
ஆனால் ஒரே ஒரு IP-க்குப் பதிலாக, அந்த Service-ஆல் தேர்ந்தெடுக்கப்பட்ட அனைத்து
Pod-களின் IP முகவரிகளுக்கும் (set of IPs) தீர்மானிக்கப்படும்.

### SRV பதிவுகள் {#srv-records}

SRV பதிவுகள், சாதாரண அல்லது headless Service-களில் உள்ள பெயரிடப்பட்ட port-களுக்காக
உருவாக்கப்படுகின்றன. பெயரிடப்பட்ட ஒவ்வொரு port-க்கும் பின்வரும் வடிவத்தில் SRV
பதிவு இருக்கும்:

```
_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example
```

சாதாரண Service-களுக்கு, இந்த SRV பதிவு port எண்ணையும் domain பெயரையும்
(`my-svc.my-namespace.svc.cluster-domain.example`) சுட்டிக்காட்டும்.

Headless Service-களுக்கு, இந்த SRV பதிவு பல விடைகளை (answers) வழங்கும் — Service-ஆல்
தேர்ந்தெடுக்கப்பட்ட ஒவ்வொரு Pod-க்கும் ஒரு விடை. அந்த விடைகள் Pod-இன் port-ஐயும்
Pod-இன் domain பெயரையும் (`auto-generated-name.my-svc.my-namespace.svc.cluster-domain.example`)
சுட்டிக்காட்டும்.

## Pod-களுக்கான DNS {#dns-for-pods}

### Pod-இன் hostname மற்றும் subdomain புலங்கள் {#pod-s-hostname-and-subdomain-fields}

தற்போது ஒரு Pod உருவாக்கப்படும்போது, அதன் hostname என்பது அந்த Pod-இன்
`metadata.name` மதிப்பாக இருக்கும்.

Pod spec-ல் optional ஆன `hostname` புலம் உள்ளது, இதன் மூலம் Pod-இன்
hostname-ஐ குறிப்பிட முடியும். `hostname` குறிப்பிடப்பட்டால், அது Pod-இன்
பெயரை விட முன்னுரிமை பெறும். எடுத்துக்காட்டாக, `hostname: my-host` என்று
அமைக்கப்பட்ட Pod-இன் hostname `my-host` ஆக இருக்கும்.

Pod spec-ல் optional ஆன `subdomain` புலமும் உள்ளது, இதன் மூலம் Pod சேர்ந்துள்ள
subdomain-ஐ குறிப்பிட முடியும். எடுத்துக்காட்டாக, `default` பெயரிடல் வெளியில்
`hostname: foo` மற்றும் `subdomain: bar` என்று அமைக்கப்பட்ட ஒரு Pod-இன்
முழு தகுதியான domain பெயர் (Fully Qualified Domain Name — FQDN) பின்வருமாறு இருக்கும்:

```
foo.bar.default.svc.cluster-domain.example
```

FQDN-க்கான DNS பதிவு இருக்க வேண்டுமெனில், subdomain-ஐ கையாளும் ஒரு headless
Service தேவை. எடுத்துக்காட்டாக:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

`default-subdomain` என்ற headless Service மற்றும் `busybox-1.default-subdomain.default.svc.cluster-domain.example`
என்ற FQDN வழியாக `busybox1` Pod-ஐ அணுக முடியும்.

{{< note >}}
hostname மற்றும் subdomain ஆகியவை Pod spec-ல் இல்லாதபோது, FQDN DNS பதிவு
உருவாக்கப்படாது.
{{< /note >}}

### Pod hostname-ஐ FQDN-ஆக அமைத்தல் {#pod-sethostnameasfqdn}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Pod-இன் spec-ல் `setHostnameAsFQDN: true` என்று அமைக்கப்பட்டால், kubelet,
Pod-இன் FQDN-ஐ hostname-ஆக அமைக்கும். இந்த வழக்கில், `hostname` கட்டளையும்
கொள்கலனுக்குள் `$HOSTNAME` மாறியும் FQDN-ஐ திருப்பி அனுப்பும்.

{{< note >}}
`setHostnameAsFQDN` செயல்படுத்தப்பட்டிருக்க, Pod-க்கு `hostname` மற்றும் `subdomain`
ஆகியவை வரையறுக்கப்பட்டிருக்க வேண்டும்.
{{< /note >}}

### Pod-இன் `setHostnameAsFQDN` புலம் {#pod-s-hostname-and-subdomain-fields-stable}

`setHostnameAsFQDN` என்பது Kubernetes 1.22 முதல் stable ஆனது. இந்த அம்சம் Pod-இன்
hostname-ஐ FQDN-ஆக அமைக்க அனுமதிக்கிறது.

### Pod DNS கொள்கை {#pod-s-dns-policy}

DNS கொள்கைகள் (DNS policies) ஒவ்வொரு Pod அடிப்படையிலும் அமைக்கப்படலாம். Kubernetes
தற்போது பின்வரும் Pod-குறிப்பிட்ட DNS கொள்கைகளை ஆதரிக்கிறது. இந்த கொள்கைகள்
Pod spec-இல் உள்ள `dnsPolicy` புலம் மூலம் குறிப்பிடப்படுகின்றன.

- `"ClusterFirst"`: cluster domain suffix என்ற `cluster.local`-ஐ பொருந்தாத எந்த DNS
  வினவலும் upstream nameserver-க்கு அனுப்பப்படும். இது node-ல் கட்டமைக்கப்பட்ட
  nameserver ஆகும். Cluster DNS கொள்கை (ClusterFirst) `hostNetwork` இல்லாத Pod-களுக்கு
  இயல்புநிலை.

- `"Default"`: Pod, அந்த Pod இயங்கும் node-ல் இருந்து DNS resolution configuration-ஐ
  பெறும். மேலும் தகவலுக்கு
  [தொடர்புடைய விவாதத்தைப்](/docs/tasks/administer-cluster/dns-custom-nameservers/)
  பார்க்கவும். `"Default"` என்பது இயல்புநிலை (default) DNS கொள்கை அல்ல. `dnsPolicy`
  குறிப்பிடப்படாவிட்டால் `"ClusterFirst"` பயன்படுத்தப்படும்.

- `"ClusterFirstWithHostNet"`: `hostNetwork`-ல் இயங்கும் Pod-களுக்கு `"ClusterFirstWithHostNet"`
  என்ற DNS கொள்கையை வெளிப்படையாக (explicitly) அமைக்க வேண்டும்.

  {{< note >}}
  இது Windows-ல் ஆதரிக்கப்படவில்லை. விவரங்களுக்கு கீழே பார்க்கவும்.
  {{< /note >}}

- `"None"`: Kubernetes சூழலிலிருந்து DNS அமைப்புகளை புறக்கணிக்க Pod-ஐ அனுமதிக்கிறது.
  அனைத்து DNS அமைப்புகளும் Pod spec-இல் உள்ள `dnsConfig` புலம் மூலம் வழங்கப்படல்
  வேண்டும். `dnsPolicy: "None"` அமைக்கும்போது `dnsConfig` கட்டாயம் குறிப்பிட வேண்டும்.

{{< note >}}
"Default" DNS கொள்கை, உண்மையிலேயே இயல்புநிலை அல்ல. `dnsPolicy` வெளிப்படையாக
குறிப்பிடப்படாவிட்டால், `"ClusterFirst"` பயன்படுத்தப்படும்.
{{< /note >}}

கீழே உள்ள எடுத்துக்காட்டில், DNS கொள்கை `"ClusterFirstWithHostNet"` ஆக அமைக்கப்பட்டுள்ளது,
ஏனெனில் Pod-க்கு `hostNetwork: true` அமைக்கப்பட்டுள்ளது:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### Pod-இன் DNS Config {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Pod DNS Config, பயனர்களுக்கு ஒரு Pod-இன் DNS அமைப்புகளை மேலும் கட்டுப்படுத்த
அனுமதிக்கிறது.

`dnsConfig` புலம் optional ஆனது, மேலும் எந்த `dnsPolicy` அமைப்பிலும் வேலை செய்யும்.
இருப்பினும், Pod-இன் `dnsPolicy` `"None"` ஆக அமைக்கப்பட்டால், `dnsConfig` புலம்
குறிப்பிடப்படல் வேண்டும்.

பயனர் `dnsConfig` புலத்தில் பின்வரும் பண்புகளை (properties) குறிப்பிடலாம்:

- `nameservers`: Pod-க்கான DNS server-களின் IP முகவரிகளின் பட்டியல். `dnsPolicy`
  `"None"` ஆக இருக்கும்போது அதிகபட்சம் 3 IP முகவரிகள் குறிப்பிட முடியும்.
  `dnsPolicy` வேறு மதிப்பில் இருக்கும்போது, இந்த பட்டியல் base nameserver-களில்
  இணைக்கப்படும், நகல்கள் நீக்கப்படும்.

- `searches`: Pod-ல் hostname தீர்மானத்திற்கான DNS search domain-களின் பட்டியல்.
  optional ஆனது. குறிப்பிடப்பட்டால், இந்த பட்டியல் தேர்ந்தெடுக்கப்பட்ட DNS கொள்கையிலிருந்து
  உருவாக்கப்பட்ட base search domain-களில் இணைக்கப்படும். நகல்கள் நீக்கப்படும்.
  Kubernetes குறைந்தது 6 search domain-களை (அனைத்து search domain-களின் மொத்த நீளத்தில்
  256 எழுத்துக்கள் வரை) அனுமதிக்கிறது.

- `options`: optional ஆன object-களின் பட்டியல், ஒவ்வொன்றும் `name` பண்பு (கட்டாயம்)
  மற்றும் `value` பண்பு (optional) கொண்டது. இந்த object-களில் உள்ள options,
  குறிப்பிட்ட DNS கொள்கையிலிருந்து உருவாக்கப்பட்ட options-ல் இணைக்கப்படும்.
  நகல்கள் நீக்கப்படும்.

கீழே DNS அமைப்புகளுடன் ஒரு Pod-இன் எடுத்துக்காட்டு உள்ளது:

```yaml
apiVersion: v1
kind: Pod
metadata:
  namespace: default
  name: dns-example
spec:
  containers:
    - name: test
      image: nginx
  dnsPolicy: "None"
  dnsConfig:
    nameservers:
      - 192.0.2.1
    searches:
      - ns1.svc.cluster-domain.example
      - my.dns.search.suffix
    options:
      - name: ndots
        value: "2"
      - name: edns0
```

மேலே உள்ள Pod உருவாக்கப்பட்டால், `test` கொள்கலனில் `/etc/resolv.conf` கோப்பில்
பின்வரும் உள்ளடக்கம் இருக்கும்:

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

IPv6 அமைப்பிற்கு, தேட பாதை மற்றும் name server அமைப்பு பின்வருமாறு இருக்க வேண்டும்:

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

வெளியீடு பின்வருமாறு இருக்கும்:

```
nameserver fd00:79:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

## hostAlias-ஐப் பயன்படுத்தி Pod-இன் /etc/hosts கோப்பில் உள்ளீடுகளைச் சேர்த்தல் {#adding-entries-to-pod-etc-hosts-with-host-aliases}

DNS மற்றும் மற்ற விருப்பங்கள் (options) வழங்காத hostname-ஐ தீர்மானிக்க,
Pod-இன் `/etc/hosts` கோப்பில் உள்ளீடுகளைச் சேர்க்கலாம்.
Pod spec-இல் `hostAliases` புலம் மூலம் custom உள்ளீடுகளைச் சேர்க்கலாம்.

`hostAliases` இல்லாமல் கோப்பை மாற்றுவது பரிந்துரைக்கப்படவில்லை,
ஏனெனில் கோப்பு kubelet-ஆல் நிர்வகிக்கப்படுகிறது, Pod உருவாக்கம்/மறுதொடக்கம் போன்ற
நேரங்களில் மேலெழுதப்படலாம்.

### hostAliases உடன் Pod {#pod-with-hostaliases}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hostaliases-pod
spec:
  restartPolicy: Never
  hostAliases:
  - ip: "127.0.0.1"
    hostnames:
    - "foo.local"
    - "bar.local"
  - ip: "10.1.2.3"
    hostnames:
    - "foo.remote"
    - "bar.remote"
  containers:
  - name: cat-hosts
    image: busybox:1.28
    command:
    - cat
    args:
    - "/etc/hosts"
```

ஒரு Pod, `hostAliases`-ஐப் பயன்படுத்தும்போது `/etc/hosts` கோப்பு பின்வருமாறு
தெரியும்:

```
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

## DNS பதிவு எடுத்துக்காட்டுகள் {#dns-records-examples}

### Service A/AAAA பதிவு எடுத்துக்காட்டு {#service-a-aaaa-record-example}

`default` பெயரிடல் வெளியில் (Namespace) `my-service` என்ற Service இருந்தால், அதன்
DNS பதிவு பின்வருமாறு இருக்கும்:

```
my-service.default.svc.cluster.local
```

இந்த DNS பெயர் Service-இன் cluster IP-க்கு தீர்மானிக்கப்படும்.

### Headless Service பதிவு எடுத்துக்காட்டு {#headless-service-record-example}

`default` பெயரிடல் வெளியில் `my-headless-service` என்ற headless Service (ClusterIP: None)
இருந்தால், அதே DNS பெயர் `my-headless-service.default.svc.cluster.local`
Service-ஆல் தேர்ந்தெடுக்கப்பட்ட அனைத்து Pod-களின் IP முகவரிகளுக்கு தீர்மானிக்கப்படும்.

### Pod A/AAAA பதிவு எடுத்துக்காட்டு {#pod-a-aaaa-record-example}

Pod-களுக்கு A/AAAA பதிவுகள் பின்வரும் வடிவத்தில் உருவாக்கப்படுகின்றன:

```
pod-ip-address.my-namespace.pod.cluster-domain.example
```

எடுத்துக்காட்டாக, `default` பெயரிடல் வெளியில் `172.17.0.3` என்ற IP கொண்ட
ஒரு Pod-இன் DNS பெயர் பின்வருமாறு இருக்கும்:

```
172-17-0-3.default.pod.cluster.local
```

## IPv6 {#ipv6}

IPv6 கொத்தில் (cluster), DNS பதிவுகள் AAAA வடிவத்தில் இருக்கும். Service-களுக்கு
IPv6 ClusterIP ஒதுக்கப்படும், Pod-களுக்கு IPv6 IP முகவரி ஒதுக்கப்படும்.

IPv6 DNS பதிவு வடிவம்:

```
my-svc.my-namespace.svc.cluster-domain.example  →  IPv6 address (AAAA)
```

dual-stack கொத்தில் (cluster), Service-கள் IPv4 மற்றும் IPv6 இரண்டிற்கும் DNS
பதிவுகளைப் பெறும்.

## Windows இல் DNS {#dns-on-windows}

Windows node-களில் இயங்கும் Pod-களுக்கு பின்வரும் வரையறைகள் (limitations) உள்ளன:

- `ClusterFirstWithHostNet` DNS கொள்கை Windows Pod-களுக்கு ஆதரிக்கப்படவில்லை.
  Windows, host network-ஐ பயன்படுத்தும் Pod-களை CoreDNS-ஐ DNS server-ஆகப்
  பயன்படுத்துவதாகக் கருதுகிறது.
- Windows-ல், ஒரு namespace-க்கு ஒரே ஒரு DNS suffix மட்டுமே ஆதரிக்கப்படுகிறது.
  இதனால், Windows Pod-கள் குறுகிய பெயர்களால் (short names) Service-களை தீர்மானிக்க
  முடியாது.

## {{% heading "whatsnext" %}}

DNS கொள்கைகளை நிர்வகித்தல் குறித்த வழிகாட்டுதலுக்கு,
[DNS சேவையை கட்டமைக்கவும்](/docs/tasks/administer-cluster/dns-custom-nameservers/) பார்க்கவும்.
