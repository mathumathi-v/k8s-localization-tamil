---
title: கட்டளை வரி கருவி (kubectl)
content_type: reference
weight: 110
no_list: true
card:
  name: reference
  title: kubectl கட்டளை வரி கருவி
  weight: 20
---

<!-- overview -->
{{< glossary_definition prepend="Kubernetes வழங்குகிறது" term_id="kubectl" length="short" >}}

இந்தக் கருவியின் பெயர் `kubectl`.

உள்ளமைவுக்காக (configuration), `kubectl` ஆனது `$HOME/.kube` கோப்பகத்தில் (directory) `config` என்ற பெயரிலுள்ள கோப்பை (file) தேடும்.
`KUBECONFIG` சூழல் மாறியை (environment variable) அமைப்பதன் மூலமாகவோ அல்லது
[`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) கொடியை (flag) பயன்படுத்துவதன் மூலமாகவோ
மற்ற [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) கோப்புகளை நீங்கள் குறிப்பிடலாம்.

இந்த மேலோட்டம் (overview) `kubectl` தொடரியல் (syntax) விளக்கும், கட்டளை செயல்பாடுகளை விவரிக்கும், மற்றும் பொதுவான எடுத்துக்காட்டுகளை வழங்கும்.
ஒவ்வொரு கட்டளையின் விவரங்களுக்கும் — ஆதரிக்கப்படும் அனைத்து கொடிகள் (flags) மற்றும் துணைக்கட்டளைகள் (subcommands) உட்பட —
[kubectl](/docs/reference/kubectl/generated/kubectl/) குறிப்பு ஆவணங்களை (reference documentation) பாருங்கள்.

ஒரு மேலோட்டத்திற்கு, [The kubectl command-line tool](/docs/concepts/overview/kubectl/) பாருங்கள்.
நிறுவல் வழிமுறைகளுக்கு (installation instructions), [Installing kubectl](/docs/tasks/tools/#kubectl) பாருங்கள்;
விரைவு வழிகாட்டிக்கு (quick guide), [cheat sheet](/docs/reference/kubectl/quick-reference/) பாருங்கள்.
நீங்கள் `docker` கட்டளை வரி கருவியை பயன்படுத்துவதில் பழக்கமுள்ளவராக இருந்தால்,
[`kubectl` for Docker Users](/docs/reference/kubectl/docker-cli-to-kubectl/) என்பது Kubernetes க்கான சில சமான (equivalent) கட்டளைகளை விளக்குகிறது.

<!-- body -->

## தொடரியல் (Syntax)

உங்கள் முனையம் (terminal) சாளரத்தில் இருந்து `kubectl` கட்டளைகளை இயக்க பின்வரும் தொடரியலை (syntax) பயன்படுத்துங்கள்:

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

இங்கு `command`, `TYPE`, `NAME`, மற்றும் `flags` என்பவை:

* `command`: நீங்கள் ஒன்று அல்லது அதிகமான வளங்களில் (resources) செய்ய விரும்பும் செயல்பாட்டை (operation) குறிப்பிடுகிறது —
  எடுத்துக்காட்டாக `create`, `get`, `describe`, `delete`.

* `TYPE`: [வள வகையை (resource type)](#resource-types) குறிப்பிடுகிறது. வள வகைகள் (Resource types) பெரியெழுத்து-சிறியெழுத்து வேறுபாடின்றி (case-insensitive) உள்ளன,
  மேலும் ஒருமை (singular), பன்மை (plural), அல்லது சுருக்கெழுத்து (abbreviated) வடிவங்களை குறிப்பிடலாம்.
  எடுத்துக்காட்டாக, பின்வரும் கட்டளைகள் ஒரே வெளியீட்டை உருவாக்கும்:

  ```shell
  kubectl get pod pod1
  kubectl get pods pod1
  kubectl get po pod1
  ```

* `NAME`: வளத்தின் (resource) பெயரை குறிப்பிடுகிறது. பெயர்கள் பெரியெழுத்து-சிறியெழுத்து வேறுபாடுடையவை (case-sensitive). பெயர் தவிர்க்கப்பட்டால்,
  அனைத்து வளங்களுக்கான விவரங்களும் காட்டப்படும் — எடுத்துக்காட்டாக `kubectl get pods`.

  பல வளங்களில் (multiple resources) ஒரு செயல்பாட்டை மேற்கொள்ளும்போது, ஒவ்வொரு வளத்தையும்
  வகை மற்றும் பெயரால் குறிப்பிடலாம் அல்லது ஒன்று அல்லது அதிகமான கோப்புகளை குறிப்பிடலாம்:

  * வகை மற்றும் பெயரால் வளங்களை குறிப்பிட:

    * அதே வகையில் உள்ள வளங்களை தொகுக்க: `TYPE1 name1 name2 name<#>`.<br/>
      எடுத்துக்காட்டு: `kubectl get pod example-pod1 example-pod2`

    * பல வள வகைகளை தனித்தனியாக குறிப்பிட: `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
      எடுத்துக்காட்டு: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`

  * ஒன்று அல்லது அதிகமான கோப்புகளுடன் வளங்களை குறிப்பிட: `-f file1 -f file2 -f file<#>`

    * உள்ளமைவு கோப்புகளுக்கு (configuration files) JSON ஐ விட YAML ஐ பயன்படுத்துங்கள்,
      ஏனென்றால் YAML பொதுவாக அதிக பயனர்-நட்பானது.<br/>
      எடுத்துக்காட்டு: `kubectl get -f ./pod.yaml`

* `flags`: விருப்பமான (optional) கொடிகளை (flags) குறிப்பிடுகிறது. எடுத்துக்காட்டாக, Kubernetes API சேவையகத்தின் (server)
  முகவரி மற்றும் துறைமுகத்தை (port) குறிப்பிட `-s` அல்லது `--server` கொடிகளை பயன்படுத்தலாம்.<br/>

{{< caution >}}
கட்டளை வரியிலிருந்து நீங்கள் குறிப்பிடும் கொடிகள் (flags) இயல்புநிலை (default) மதிப்புகளையும் தொடர்புடைய சூழல் மாறிகளையும் (environment variables) மேலெழுதும் (override).
{{< /caution >}}

உதவி தேவைப்பட்டால், முனையம் சாளரத்திலிருந்து (terminal window) `kubectl help` இயக்குங்கள்.

## கொத்துக்குள் அங்கீகாரம் மற்றும் பெயரிடல் வெளி மேலெழுதல் (In-cluster authentication and namespace overrides)

இயல்பாக (by default) `kubectl` முதலில் அது ஒரு pod க்குள்ளே, அதாவது ஒரு கொத்துக்குள் (cluster) இயங்குகிறதா என்று தீர்மானிக்கும்.
அது `KUBERNETES_SERVICE_HOST` மற்றும் `KUBERNETES_SERVICE_PORT` சூழல் மாறிகளையும்
`/var/run/secrets/kubernetes.io/serviceaccount/token` இல் ஒரு service account token கோப்பு இருக்கிறதா என்றும் சரிபார்க்கும்.
மூன்றும் கிடைத்தால், கொத்துக்குள் அங்கீகாரம் (in-cluster authentication) என்று கருதப்படும்.

பின்னோக்கி இணக்கத்தன்மையை (backwards compatibility) பராமரிக்க, கொத்துக்குள் அங்கீகாரத்தின் போது (during in-cluster authentication)
`POD_NAMESPACE` சூழல் மாறி அமைக்கப்பட்டிருந்தால், அது service account token இல் உள்ள இயல்புநிலை பெயரிடல் வெளியை (default namespace)
மேலெழுதும் (override). பெயரிடல் வெளி இயல்புகளை நம்பியிருக்கும் எந்த manifests அல்லது கருவிகளும் இதனால் பாதிக்கப்படும்.

**`POD_NAMESPACE` சூழல் மாறி (environment variable)**

`POD_NAMESPACE` சூழல் மாறி அமைக்கப்பட்டிருந்தால், பெயரிடல் வெளிக்கு (namespaced) உட்பட்ட வளங்களில் CLI செயல்பாடுகள்
அந்த மாறியின் மதிப்பை இயல்பாக (default) பயன்படுத்தும். எடுத்துக்காட்டாக, மாறி `seattle` என அமைக்கப்பட்டிருந்தால்,
`kubectl get pods` ஆனது `seattle` பெயரிடல் வெளியில் (namespace) உள்ள pods ஐ திருப்பித் தரும். ஏனென்றால் pods என்பது
பெயரிடல் வெளி வளம் (namespaced resource), மேலும் கட்டளையில் எந்த பெயரிடல் வெளியும் (namespace) வழங்கப்படவில்லை.
ஒரு வளம் பெயரிடல் வெளிக்கு (namespaced) உட்பட்டதா என்று தீர்மானிக்க `kubectl api-resources` இன் வெளியீட்டை பாருங்கள்.

`--namespace <value>` ஐ வெளிப்படையாக பயன்படுத்துவது இந்த நடத்தையை மேலெழுதும் (override).

**kubectl ServiceAccount tokens ஐ எவ்வாறு கையாள்கிறது**

பின்வரும் நிலைகளில்:

* `/var/run/secrets/kubernetes.io/serviceaccount/token` இல் Kubernetes service account token கோப்பு இணைக்கப்பட்டிருந்தால், மற்றும்
* `KUBERNETES_SERVICE_HOST` சூழல் மாறி அமைக்கப்பட்டிருந்தால், மற்றும்
* `KUBERNETES_SERVICE_PORT` சூழல் மாறி அமைக்கப்பட்டிருந்தால், மற்றும்
* kubectl கட்டளை வரியில் வெளிப்படையாக (explicitly) பெயரிடல் வெளியை (namespace) நீங்கள் குறிப்பிடாவிட்டால்

அப்போது kubectl அது உங்கள் கொத்துக்குள் (cluster) இயங்குவதாக கருதும். kubectl கருவி அந்த ServiceAccount இன்
பெயரிடல் வெளியை (namespace) — இது Pod இன் பெயரிடல் வெளிக்கு ஒரே மாதிரியானது — தேடி அந்த பெயரிடல் வெளிக்கு எதிராக செயல்படும்.
இது கொத்துக்கு (cluster) வெளியில் நடப்பதிலிருந்து வேறுபடுகிறது; kubectl கொத்துக்கு வெளியில் இயங்கும்போதும்
நீங்கள் பெயரிடல் வெளியை (namespace) குறிப்பிடாவிட்டாலும், kubectl கட்டளை உங்கள் கிளையண்ட் உள்ளமைவில் (client configuration)
தற்போதைய சூழலுக்கு (current context) அமைக்கப்பட்ட பெயரிடல் வெளிக்கு எதிராக செயல்படும்.
உங்கள் kubectl க்கான இயல்புநிலை பெயரிடல் வெளியை (default namespace) மாற்ற பின்வரும் கட்டளையை பயன்படுத்தலாம்:

```shell
kubectl config set-context --current --namespace=<namespace-name>
```

## செயல்பாடுகள் (Operations)

பின்வரும் அட்டவணை (table) அனைத்து `kubectl` செயல்பாடுகளுக்கான (operations) சுருக்கமான விளக்கங்களையும் பொதுவான தொடரியலையும் (general syntax) உள்ளடக்கியுள்ளது:

Operation       | Syntax    |       Description
-------------------- | -------------------- | --------------------
`alpha`    | `kubectl alpha SUBCOMMAND [flags]` | List the available commands that correspond to alpha features, which are not enabled in Kubernetes clusters by default.
`annotate`    | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Add or update the annotations of one or more resources.
`api-resources`    | `kubectl api-resources [flags]` | List the API resources that are available.
`api-versions`    | `kubectl api-versions [flags]` | List the API versions that are available.
`apply`            | `kubectl apply -f FILENAME [flags]`| Apply a configuration change to a resource from a file or stdin.
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | Attach to a running container either to view the output stream or interact with the container (stdin).
`auth`    | `kubectl auth [flags] [options]` | Inspect authorization.
`autoscale`    | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu=CPU] [flags]</code> | Automatically scale the set of pods that are managed by a replication controller.
`certificate`    | `kubectl certificate SUBCOMMAND [options]` | Modify certificate resources.
`cluster-info`    | `kubectl cluster-info [flags]` | Display endpoint information about the master and services in the cluster.
`completion`    | `kubectl completion SHELL [options]` | Output shell completion code for the specified shell (bash or zsh).
`config`        | `kubectl config SUBCOMMAND [flags]` | Modifies kubeconfig files. See the individual subcommands for details.
`convert`    | `kubectl convert -f FILENAME [options]` | Convert config files between different API versions. Both YAML and JSON formats are accepted. Note - requires `kubectl-convert` plugin to be installed.
`cordon`    | `kubectl cordon NODE [options]` | Mark node as unschedulable.
`cp`    | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | Copy files and directories to and from containers.
`create`        | `kubectl create -f FILENAME [flags]` | Create one or more resources from a file or stdin.
`delete`        | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | Delete resources either from a file, stdin, or specifying label selectors, names, resource selectors, or resources.
`describe`    | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | Display the detailed state of one or more resources.
`diff`        | `kubectl diff -f FILENAME [flags]`| Diff file or stdin against live configuration.
`drain`    | `kubectl drain NODE [options]` | Drain node in preparation for maintenance.
`edit`        | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | Edit and update the definition of one or more resources on the server by using the default editor.
`events`      | `kubectl events` | List events
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Execute a command against a container in a pod.
`explain`    | `kubectl explain TYPE [--recursive=false] [flags]` | Get documentation of various resources. For instance pods, nodes, services, etc.
`expose`        | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | Expose a replication controller, service, or pod as a new Kubernetes service.
`get`        | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | List one or more resources.
`kustomize`    | `kubectl kustomize <dir> [flags] [options]` | List a set of API resources generated from instructions in a kustomization.yaml file. The argument must be the path to the directory containing the file, or a git repository URL with a path suffix specifying same with respect to the repository root.
`label`        | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Add or update the labels of one or more resources.
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Print the logs for a container in a pod.
`options`    | `kubectl options` | List of global command-line options, which apply to all commands.
`patch`        | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | Update one or more fields of a resource by using the strategic merge patch process.
`plugin`    | `kubectl plugin [flags] [options]` | Provides utilities for interacting with plugins.
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | Forward one or more local ports to a pod.
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Run a proxy to the Kubernetes API server.
`replace`        | `kubectl replace -f FILENAME` | Replace a resource from a file or stdin.
`rollout`    | `kubectl rollout SUBCOMMAND [options]` | Manage the rollout of a resource. Valid resource types include: deployments, daemonsets and statefulsets.
`run`        | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server&#124;client&#124;none] [--overrides=inline-json] [flags]</code> | Run a specified image on the cluster.
`scale`        | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | Update the size of the specified replication controller.
`set`    | `kubectl set SUBCOMMAND [options]` | Configure application resources.
`taint`    | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | Update the taints on one or more nodes.
`top`    | <code>kubectl top (POD &#124; NODE) [flags] [options]</code> | Display Resource (CPU/Memory/Storage) usage of pod or node.
`uncordon`    | `kubectl uncordon NODE [options]` | Mark node as schedulable.
`version`        | `kubectl version [--client] [flags]` | Display the Kubernetes version running on the client and server.
`wait`    | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | Experimental: Wait for a specific condition on one or many resources.

கட்டளை செயல்பாடுகளைப் பற்றி மேலும் அறிய, [kubectl](/docs/reference/kubectl/kubectl/) குறிப்பு ஆவணங்களை (reference documentation) பாருங்கள்.

## வள வகைகள் (Resource types) {#resource-types}

பின்வரும் அட்டவணை ஆதரிக்கப்படும் அனைத்து வள வகைகளையும் அவற்றின் சுருக்கப்பட்ட மாற்றுப்பெயர்களையும் (abbreviated aliases) பட்டியலிடுகிறது.

(இந்த வெளியீட்டை `kubectl api-resources` மூலம் பெறலாம்; இது Kubernetes 1.25.0 நிலவரப்படி துல்லியமானது)

| NAME | SHORTNAMES | APIVERSION | NAMESPACED | KIND |
|---|---|---|---|---|
| `bindings` |  | v1 | true | Binding |
| `componentstatuses` | `cs` | v1 | false | ComponentStatus |
| `configmaps` | `cm` | v1 | true | ConfigMap |
| `endpoints` | `ep` | v1 | true | Endpoints |
| `events` | `ev` | v1 | true | Event |
| `limitranges` | `limits` | v1 | true | LimitRange |
| `namespaces` | `ns` | v1 | false | Namespace |
| `nodes` | `no` | v1 | false | Node |
| `persistentvolumeclaims` | `pvc` | v1 | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | v1 | false | PersistentVolume |
| `pods` | `po` | v1 | true | Pod |
| `podtemplates` |  | v1 | true | PodTemplate |
| `replicationcontrollers` | `rc` | v1 | true | ReplicationController |
| `resourcequotas` | `quota` | v1 | true | ResourceQuota |
| `secrets` |  | v1 | true | Secret |
| `serviceaccounts` | `sa` | v1 | true | ServiceAccount |
| `services` | `svc` | v1 | true | Service |
| `mutatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd,crds` | apiextensions.k8s.io/v1 | false | CustomResourceDefinition |
| `apiservices` |  | apiregistration.k8s.io/v1 | false | APIService |
| `controllerrevisions` |  | apps/v1 | true | ControllerRevision |
| `daemonsets` | `ds` | apps/v1 | true | DaemonSet |
| `deployments` | `deploy` | apps/v1 | true | Deployment |
| `replicasets` | `rs` | apps/v1 | true | ReplicaSet |
| `statefulsets` | `sts` | apps/v1 | true | StatefulSet |
| `tokenreviews` |  | authentication.k8s.io/v1 | false | TokenReview |
| `localsubjectaccessreviews` |  | authorization.k8s.io/v1 | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectRulesReview |
| `subjectaccessreviews` |  | authorization.k8s.io/v1 | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling/v2 | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch/v1 | true | CronJob |
| `jobs` |  | batch/v1 | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io/v1 | false | CertificateSigningRequest |
| `leases` |  | coordination.k8s.io/v1 | true | Lease |
| `endpointslices` |  | discovery.k8s.io/v1 | true | EndpointSlice |
| `events` | `ev` | events.k8s.io/v1 | true | Event |
| `flowschemas` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | FlowSchema |
| `prioritylevelconfigurations` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | PriorityLevelConfiguration |
| `ingressclasses` |  | networking.k8s.io/v1 | false | IngressClass |
| `ingresses` | `ing` | networking.k8s.io/v1 | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io/v1 | true | NetworkPolicy |
| `runtimeclasses` |  | node.k8s.io/v1 | false | RuntimeClass |
| `poddisruptionbudgets` | `pdb` | policy/v1 | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy/v1beta1 | false | PodSecurityPolicy |
| `clusterrolebindings` |  | rbac.authorization.k8s.io/v1 | false | ClusterRoleBinding |
| `clusterroles` |  | rbac.authorization.k8s.io/v1 | false | ClusterRole |
| `rolebindings` |  | rbac.authorization.k8s.io/v1 | true | RoleBinding |
| `roles` |  | rbac.authorization.k8s.io/v1 | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io/v1 | false | PriorityClass |
| `csidrivers` |  | storage.k8s.io/v1 | false | CSIDriver |
| `csinodes` |  | storage.k8s.io/v1 | false | CSINode |
| `csistoragecapacities` |  | storage.k8s.io/v1 | true | CSIStorageCapacity |
| `storageclasses` | `sc` | storage.k8s.io/v1 | false | StorageClass |
| `volumeattachments` |  | storage.k8s.io/v1 | false | VolumeAttachment |

## வெளியீட்டு விருப்பங்கள் (Output options)

சில கட்டளைகளின் வெளியீட்டை எவ்வாறு வடிவமைப்பது (format) அல்லது வரிசைப்படுத்துவது (sort) என்பதற்கான தகவலுக்கு
பின்வரும் பிரிவுகளைப் (sections) பாருங்கள். எந்த கட்டளைகள் பல்வேறு வெளியீட்டு விருப்பங்களை (output options) ஆதரிக்கின்றன
என்ற விவரங்களுக்கு, [kubectl](/docs/reference/kubectl/kubectl/) குறிப்பு ஆவணங்களை (reference documentation) பாருங்கள்.

### வெளியீட்டை வடிவமைத்தல் (Formatting output)

அனைத்து `kubectl` கட்டளைகளுக்கும் இயல்புநிலை வெளியீட்டு வடிவம் (default output format) மனிதர் படிக்கக்கூடிய
எளிய-உரை வடிவம் (plain-text format) ஆகும். உங்கள் முனையம் சாளரத்தில் (terminal window) குறிப்பிட்ட வடிவத்தில் (specific format)
விவரங்களை வெளியிட, ஆதரவான `kubectl` கட்டளையில் `-o` அல்லது `--output` கொடிகளை சேர்க்கலாம்.

#### தொடரியல் (Syntax)

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

`kubectl` செயல்பாட்டைப் பொறுத்து, பின்வரும் வெளியீட்டு வடிவங்கள் (output formats) ஆதரிக்கப்படுகின்றன:

Output format | Description
--------------| -----------
`-o custom-columns=<spec>` | Print a table using a comma separated list of [custom columns](#custom-columns).
`-o custom-columns-file=<filename>` | Print a table using the [custom columns](#custom-columns) template in the `<filename>` file.
`-o json`     | Output a JSON formatted API object.
`-o jsonpath=<template>` | Print the fields defined in a [jsonpath](/docs/reference/kubectl/jsonpath/) expression.
`-o jsonpath-file=<filename>` | Print the fields defined by the [jsonpath](/docs/reference/kubectl/jsonpath/) expression in the `<filename>` file.
`-o kyaml`    | Output a [KYAML](/docs/reference/encodings/kyaml/) formatted API object (beta).
`-o name`     | Print only the resource name and nothing else.
`-o wide`     | Output in the plain-text format with any additional information. For pods, the node name is included.
`-o yaml`     | Output a YAML formatted API object. KYAML is an experimental Kubernetes-specific dialect of YAML, and can be parsed as YAML.

##### எடுத்துக்காட்டு (Example)

இந்த எடுத்துக்காட்டில், பின்வரும் கட்டளை ஒரு single pod இன் விவரங்களை YAML வடிவமைக்கப்பட்ட (YAML formatted) பொருளாக வெளியிடுகிறது:

```shell
kubectl get pod web-pod-13je7 -o yaml
```

நினைவில் வைத்துக்கொள்ளுங்கள்: ஒவ்வொரு கட்டளையாலும் எந்த வெளியீட்டு வடிவம் ஆதரிக்கப்படுகிறது என்ற விவரங்களுக்கு
[kubectl](/docs/reference/kubectl/kubectl/) குறிப்பு ஆவணங்களை (reference documentation) பாருங்கள்.

#### தனிப்பயன் நெடுவரிசைகள் (Custom columns)

தனிப்பயன் நெடுவரிசைகளை (custom columns) வரையறுத்து நீங்கள் விரும்பும் விவரங்களை மட்டும் அட்டவணையில் வெளியிட,
`custom-columns` விருப்பத்தை பயன்படுத்தலாம். நேரடியாக (inline) வரையறுக்கலாம் அல்லது
ஒரு வார்ப்புரு கோப்பை (template file) பயன்படுத்தலாம்: `-o custom-columns=<spec>` அல்லது `-o custom-columns-file=<filename>`.

##### எடுத்துக்காட்டுகள் (Examples)

நேரடி (Inline):

```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

வார்ப்புரு கோப்பு (Template file):

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

இங்கு `template.txt` கோப்பில் பின்வருவன உள்ளன:

```
NAME          RSRC
metadata.name metadata.resourceVersion
```

இரண்டு கட்டளைகளில் எதை இயக்கினாலும் வெளியீடு இதற்கு ஒத்திருக்கும்:

```
NAME           RSRC
submit-queue   610995
```

#### சேவையக-பக்க நெடுவரிசைகள் (Server-side columns)

`kubectl` சேவையகத்திலிருந்து (server) பொருட்களைப் (objects) பற்றிய குறிப்பிட்ட நெடுவரிசை தகவலை (column information) பெறுவதை ஆதரிக்கிறது.
அதாவது, எந்த வளத்திற்கும் (resource), சேவையகம் அந்த வளத்திற்கு பொருந்தும் நெடுவரிசைகளையும் வரிசைகளையும் (columns and rows)
கிளையண்டுக்கு (client) திருப்பித் தரும், அது அச்சிட (print). இது ஒரே கொத்துக்கு (cluster) எதிராக பயன்படுத்தப்படும்
கிளையண்டுகள் முழுவதும் (across clients) சீரான மனிதர்-படிக்கக்கூடிய வெளியீட்டை (human-readable output) உறுதி செய்கிறது,
ஏனென்றால் சேவையகம் அச்சிடும் விவரங்களை (details of printing) கையாள்கிறது.

இந்த அம்சம் இயல்பாக (by default) இயக்கப்பட்டிருக்கும். அதை முடக்க (disable),
`kubectl get` கட்டளையில் `--server-print=false` கொடியை சேர்க்கவும்.

##### எடுத்துக்காட்டுகள் (Examples)

ஒரு pod இன் நிலை (status) பற்றிய தகவலை அச்சிட, பின்வருவதைப் போன்ற கட்டளையை பயன்படுத்துங்கள்:

```shell
kubectl get pods <pod-name> --server-print=false
```

வெளியீடு இதற்கு ஒத்திருக்கும்:

```
NAME       AGE
pod-name   1m
```

### பட்டியல் பொருட்களை வரிசைப்படுத்துதல் (Sorting list objects)

உங்கள் முனையம் சாளரத்தில் (terminal window) வரிசைப்படுத்தப்பட்ட (sorted) பட்டியலாக பொருட்களை வெளியிட,
ஆதரவான `kubectl` கட்டளையில் `--sort-by` கொடியை சேர்க்கலாம். `--sort-by` கொடியுடன் எந்த எண் அல்லது சரம் (string) புலத்தையும் (field) குறிப்பிட்டு
உங்கள் பொருட்களை வரிசைப்படுத்துங்கள். ஒரு புலத்தை குறிப்பிட,
[jsonpath](/docs/reference/kubectl/jsonpath/) வெளிப்பாட்டை (expression) பயன்படுத்துங்கள்.

#### தொடரியல் (Syntax)

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### எடுத்துக்காட்டு (Example)

பெயரால் வரிசைப்படுத்தப்பட்ட pods பட்டியலை அச்சிட, இயக்குங்கள்:

```shell
kubectl get pods --sort-by=.metadata.name
```

## எடுத்துக்காட்டுகள்: பொதுவான செயல்பாடுகள் (Examples: Common operations)

பொதுவாக பயன்படுத்தப்படும் `kubectl` செயல்பாடுகளை இயக்குவதில் தெரிந்துகொள்ள பின்வரும் எடுத்துக்காட்டுகளை பயன்படுத்துங்கள்:

`kubectl apply` - ஒரு கோப்பு அல்லது stdin இலிருந்து (from a file or stdin) ஒரு வளத்தில் (resource) மாற்றங்களை பயன்படுத்து அல்லது புதுப்பி.

```shell
# example-service.yaml இல் உள்ள வரையறையை பயன்படுத்தி ஒரு சேவையை (service) உருவாக்கு.
kubectl apply -f example-service.yaml

# example-controller.yaml இல் உள்ள வரையறையை பயன்படுத்தி ஒரு replication controller ஐ உருவாக்கு.
kubectl apply -f example-controller.yaml

# <directory> கோப்பகத்தில் உள்ள எந்த .yaml, .yml, அல்லது .json கோப்பிலும் வரையறுக்கப்பட்ட பொருட்களை உருவாக்கு.
kubectl apply -f <directory>
```

`kubectl get` - ஒன்று அல்லது அதிகமான வளங்களை (resources) பட்டியலிடு.

```shell
# எளிய-உரை வெளியீட்டு வடிவத்தில் (plain-text output format) அனைத்து pods ஐயும் பட்டியலிடு.
kubectl get pods

# எளிய-உரை வெளியீட்டு வடிவத்தில் அனைத்து pods ஐயும் பட்டியலிட்டு கூடுதல் தகவலையும் (node பெயர் போன்றவை) சேர்.
kubectl get pods -o wide

# குறிப்பிட்ட பெயருடன் replication controller ஐ எளிய-உரை வெளியீட்டு வடிவத்தில் பட்டியலிடு. குறிப்பு: 'replicationcontroller' வள வகையை 'rc' என்ற மாற்றுப்பெயருடன் (alias) சுருக்கலாம்.
kubectl get replicationcontroller <rc-name>

# அனைத்து replication controllers மற்றும் services ஐயும் ஒன்றாக எளிய-உரை வெளியீட்டு வடிவத்தில் பட்டியலிடு.
kubectl get rc,services

# எளிய-உரை வெளியீட்டு வடிவத்தில் அனைத்து daemon sets ஐயும் பட்டியலிடு.
kubectl get ds

# server01 Node இல் இயங்கும் அனைத்து pods ஐயும் பட்டியலிடு
kubectl get pods --field-selector=spec.nodeName=server01
```

`kubectl describe` - ஒன்று அல்லது அதிகமான வளங்களின் விரிவான நிலையை (detailed state) காட்டு — இயல்பாக துவக்கப்படாத (uninitialized) வளங்கள் உட்பட.

```shell
# <node-name> என்ற பெயருடன் உள்ள Node இன் விவரங்களை காட்டு.
kubectl describe nodes <node-name>

# <pod-name> என்ற பெயருடன் உள்ள pod இன் விவரங்களை காட்டு.
kubectl describe pods/<pod-name>

# <rc-name> என்ற replication controller நிர்வகிக்கும் அனைத்து pods இன் விவரங்களை காட்டு.
# நினைவில் வைத்துக்கொள்ளுங்கள்: replication controller உருவாக்கும் எந்த pods உம் அந்த replication controller இன் பெயரால் முன்னொட்டப்படும் (prefixed).
kubectl describe pods <rc-name>

# அனைத்து pods ஐயும் விவரி
kubectl describe pods
```

{{< note >}}
`kubectl get` கட்டளை பொதுவாக ஒரே வள வகையின் ஒன்று அல்லது அதிகமான
வளங்களை பெற பயன்படுத்தப்படுகிறது. இது `-o` அல்லது `--output` கொடியை பயன்படுத்தி
வெளியீட்டு வடிவத்தை தனிப்பயனாக்க (customize) அனுமதிக்கும் ஒரு செழுமையான கொடி தொகுப்பை (rich set of flags) கொண்டுள்ளது.
குறிப்பிட்ட ஒரு பொருளுக்கான புதுப்பிப்புகளை (updates) கண்காணிக்கத் தொடங்க `-w` அல்லது `--watch` கொடியை குறிப்பிடலாம்.
`kubectl describe` கட்டளை குறிப்பிட்ட வளத்தின் (resource) பல தொடர்புடைய அம்சங்களை (related aspects) விவரிக்க
அதிகமாக கவனம் செலுத்துகிறது. இது பயனருக்கான காட்சியை (view) உருவாக்க API சேவையகத்திற்கு (API server)
பல API அழைப்புகளை (API calls) ஏற்படுத்தலாம். எடுத்துக்காட்டாக, `kubectl describe node` கட்டளை
Node பற்றிய தகவல்களை மட்டுமல்லாமல், அதில் இயங்கும் pods இன் சுருக்கத்தையும், Node க்காக உருவாக்கப்பட்ட நிகழ்வுகளையும் (events) திரட்டும்.
{{< /note >}}

`kubectl delete` - ஒரு கோப்பு, stdin, அல்லது label selectors, பெயர்கள், resource selectors அல்லது வளங்களை குறிப்பிட்டு வளங்களை நீக்கு.

```shell
# pod.yaml கோப்பில் குறிப்பிட்ட வகை மற்றும் பெயரைப் பயன்படுத்தி ஒரு pod ஐ நீக்கு.
kubectl delete -f pod.yaml

# '<label-key>=<label-value>' என்ற label கொண்ட அனைத்து pods மற்றும் services ஐயும் நீக்கு.
kubectl delete pods,services -l <label-key>=<label-value>

# துவக்கப்படாத (uninitialized) வளங்கள் உட்பட அனைத்து pods ஐயும் நீக்கு.
kubectl delete pods --all
```

`kubectl exec` - ஒரு pod இல் உள்ள கொள்கலனுக்கு (container) எதிராக (against) ஒரு கட்டளையை இயக்கு.

```shell
# <pod-name> pod இலிருந்து 'date' இயக்கிய வெளியீட்டை பெறு. இயல்பாக, வெளியீடு முதல் கொள்கலனிலிருந்து (first container) வரும்.
kubectl exec <pod-name> -- date

# <pod-name> pod இல் <container-name> கொள்கலனில் 'date' இயக்கிய வெளியீட்டை பெறு.
kubectl exec <pod-name> -c <container-name> -- date

# <pod-name> pod இலிருந்து தொடர்புடைய TTY பெற்று /bin/bash இயக்கு. இயல்பாக, வெளியீடு முதல் கொள்கலனிலிருந்து வரும்.
kubectl exec -ti <pod-name> -- /bin/bash
```

`kubectl logs` - ஒரு pod இல் உள்ள கொள்கலனுக்கான (container) பதிவுகளை (logs) அச்சிடு.

```shell
# <pod-name> pod இலிருந்து பதிவுகளின் (logs) தற்போதைய நிலையை (snapshot) திருப்பித் தருக.
kubectl logs <pod-name>

# <pod-name> pod இலிருந்து பதிவுகளை (logs) ஸ்ட்ரீமிங் (streaming) செய்யத் தொடங்கு. இது Linux 'tail -f' கட்டளைக்கு ஒத்தது.
kubectl logs -f <pod-name>
```

`kubectl diff` - ஒரு கொத்துக்கு (cluster) முன்மொழியப்பட்ட புதுப்பிப்புகளின் (proposed updates) வேறுபாட்டை (diff) காண்க.

```shell
# "pod.json" இல் உள்ள வளங்களை வேறுபாட்டாக காட்டு.
kubectl diff -f pod.json

# stdin இலிருந்து படிக்கப்பட்ட கோப்பை வேறுபாட்டாக காட்டு.
cat service.yaml | kubectl diff -f -
```

## எடுத்துக்காட்டுகள்: சொருகிகளை (plugins) உருவாக்குதல் மற்றும் பயன்படுத்துதல் (Examples: Creating and using plugins)

`kubectl` சொருகிகளை (plugins) எழுதுவதிலும் பயன்படுத்துவதிலும் தெரிந்துகொள்ள பின்வரும் எடுத்துக்காட்டுகளை பயன்படுத்துங்கள்:

```shell
# எந்த மொழியிலும் ஒரு எளிய சொருகியை (plugin) உருவாக்கி, இயக்கக்கூடிய கோப்பின் (executable file) பெயரை
# "kubectl-" என்ற முன்னொட்டுடன் (prefix) தொடங்குமாறு பெயரிடுங்கள்
cat ./kubectl-hello
```
```shell
#!/bin/sh

# this plugin prints the words "hello world"
echo "hello world"
```
ஒரு சொருகி (plugin) எழுதப்பட்டதும், அதை இயக்கக்கூடியதாக (executable) ஆக்குவோம்:
```bash
chmod a+x ./kubectl-hello

# மற்றும் நமது PATH இல் உள்ள ஒரு இடத்திற்கு நகர்த்துவோம்
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# நீங்கள் இப்போது ஒரு kubectl சொருகியை (plugin) உருவாக்கி "நிறுவியுள்ளீர்கள்".
# இந்த சொருகியை kubectl இலிருந்து ஒரு சாதாரண கட்டளையாக செயல்படுத்தி பயன்படுத்தத் தொடங்கலாம்
kubectl hello
```
```
hello world
```

```shell
# ஒரு சொருகியை (plugin) "நிறுவல் நீக்கம்" செய்ய (uninstall), நீங்கள் அதை வைத்திருந்த
# $PATH கோப்பகத்திலிருந்து நீக்குங்கள்
sudo rm /usr/local/bin/kubectl-hello
```

`kubectl` க்கு கிடைக்கும் அனைத்து சொருகிகளையும் (plugins) பார்க்க,
`kubectl plugin list` துணைக்கட்டளையை (subcommand) பயன்படுத்துங்கள்:

```shell
kubectl plugin list
```
வெளியீடு இதற்கு ஒத்திருக்கும்:
```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```

`kubectl plugin list` இயக்க முடியாத (not executable) சொருகிகளைப் பற்றியும்,
மற்ற சொருகிகளால் மறைக்கப்பட்ட (shadowed) சொருகிகளைப் பற்றியும் உங்களுக்கு எச்சரிக்கை (warning) செய்யும்; எடுத்துக்காட்டாக:

```shell
sudo chmod -x /usr/local/bin/kubectl-foo # இயக்க அனுமதியை நீக்கு
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo identified as a plugin, but it is not executable
/usr/local/bin/kubectl-bar

error: one plugin warning was found
```

ஏற்கனவே உள்ள kubectl கட்டளைகளின் மேல் (on top of) மிகவும் சிக்கலான (complex) செயல்பாட்டை (functionality) உருவாக்க
சொருகிகளை (plugins) ஒரு வழிமுறையாக (means) நினைக்கலாம்:

```shell
cat ./kubectl-whoami
```

அடுத்த சில எடுத்துக்காட்டுகள் `kubectl-whoami` கோப்பிற்கு பின்வரும் உள்ளடக்கம் (contents) ஏற்கனவே இருப்பதாக கருதுகின்றன:

```shell
#!/bin/bash

# this plugin makes use of the `kubectl config` command in order to output
# information about the current user, based on the currently selected context
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```

மேலே உள்ள கட்டளையை இயக்குவது உங்கள் KUBECONFIG கோப்பில் (file) தற்போதைய சூழலுக்கான (current context) பயனரை (user)
கொண்ட வெளியீட்டை தருகிறது:

```shell
# கோப்பை இயக்கக்கூடியதாக (executable) ஆக்கு
sudo chmod +x ./kubectl-whoami

# மற்றும் அதை உங்கள் PATH இல் நகர்த்துங்கள்
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

## {{% heading "whatsnext" %}}

* `kubectl` குறிப்பு ஆவணங்களை (reference documentation) படியுங்கள்:
  * kubectl [கட்டளை குறிப்பு (command reference)](/docs/reference/kubectl/kubectl/)
  * [கட்டளை வரி இடமாற்றிகள் (command line arguments)](/docs/reference/kubectl/generated/kubectl/) குறிப்பு
* [`kubectl` பயன்பாட்டு மரபுகளைப் (usage conventions)](/docs/reference/kubectl/conventions/) பற்றி அறியுங்கள்
* kubectl இல் [JSONPath ஆதரவைப் (JSONPath support)](/docs/reference/kubectl/jsonpath/) பற்றி படியுங்கள்
* [சொருகிகளுடன் (plugins) kubectl ஐ நீட்டிப்பது (extend kubectl)](/docs/tasks/extend-kubectl/kubectl-plugins) பற்றி படியுங்கள்
  * சொருகிகளைப் பற்றி மேலும் அறிய, [எடுத்துக்காட்டு CLI சொருகியை (example CLI plugin)](https://github.com/kubernetes/sample-cli-plugin) பாருங்கள்.
