import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContributingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="prose max-w-none">
          <h1>பங்களிப்பு வழிகாட்டி / Contributing Guide</h1>
          <p>
            Kubernetes ஆவணங்களை தமிழில் மொழிபெயர்க்க உங்கள் உதவி மிகவும் மதிப்புமிக்கது. நன்றி!
          </p>

          <h2>தொடங்குவது எப்படி</h2>
          <h3>முன்தேவைகள்</h3>
          <ul>
            <li>Git மற்றும் GitHub கணக்கு</li>
            <li>Markdown பற்றிய அடிப்படை அறிவு</li>
            <li>தமிழ் மற்றும் ஆங்கிலத்தில் புலமை</li>
            <li>Kubernetes கருத்துகளின் அறிவு (உதவியாக இருக்கும் ஆனால் தேவையில்லை)</li>
          </ul>

          <h3>அமைப்பு</h3>
          <ol>
            <li>
              <a href="https://github.com/kubernetes/website" target="_blank" rel="noopener noreferrer">
                kubernetes/website
              </a>{' '}
              repository-ஐ Fork செய்யுங்கள்
            </li>
            <li>உங்கள் fork-ஐ clone செய்யுங்கள்:
              <pre><code>git clone https://github.com/&lt;your-username&gt;/website.git</code></pre>
            </li>
            <li>உங்கள் வேலைக்கான branch உருவாக்குங்கள்:
              <pre><code>git checkout -b ta-translate-&lt;page-name&gt;</code></pre>
            </li>
          </ol>

          <h2>மொழிபெயர்ப்பு விதிகள்</h2>
          <h3>மொழிபெயர்க்க வேண்டியவை</h3>
          <ul>
            <li>அனைத்து உடல் உரை / விளக்கங்கள் → தமிழ்</li>
            <li>Front matter-இல் <code>title</code> மற்றும் <code>description</code> → தமிழ்</li>
            <li>படங்களுக்கான alt text → தமிழ்</li>
          </ul>

          <h3>மொழிபெயர்க்கக் கூடாதவை (ஆங்கிலத்தில் வைக்கவும்)</h3>
          <ul>
            <li>YAML front matter keys</li>
            <li>Code blocks மற்றும் CLI கட்டளைகள்</li>
            <li>தொழில்நுட்ப பொருள் பெயர்கள்: Pod, Node, Deployment, Service</li>
            <li>API புல பெயர்கள்: spec, metadata, replicas</li>
            <li>URL-கள் மற்றும் இணைப்புகள்</li>
            <li>Hugo shortcode தொடரியல்</li>
          </ul>

          <h3>தொழில்நுட்ப சொற்கள்</h3>
          <p>முதல் பயன்பாட்டில், ஆங்கிலமும் தமிழும் சேர்த்து எழுதுங்கள்:</p>
          <pre><code>Pod (பாட்) என்பது Kubernetes-இல் மிகச்சிறிய deploy பண்ணக்கூடிய அலகு ஆகும்.</code></pre>

          <h2>PR சமர்ப்பித்தல்</h2>
          <pre><code>{`git add content/ta/
git commit -m "[ta] Translate docs/concepts/overview/_index.md to Tamil"
git push origin ta-translate-overview`}</code></pre>
          <p>
            PR தலைப்பு வடிவம்: <code>[ta] Add Tamil localization for &lt;page name&gt;</code>
          </p>

          <h2>நடை வழிகாட்டி</h2>
          <ol>
            <li><strong>முறையான தமிழ்</strong>: எழுத்து வழக்கு பயன்படுத்துங்கள்</li>
            <li><strong>நிலைத்தன்மை</strong>: சொற்களஞ்சியத்தை எப்போதும் பார்க்கவும்</li>
            <li><strong>தெளிவு</strong>: நேரடி மொழிபெயர்ப்பு குழப்பமாக இருந்தால், தெளிவுக்காக மாற்றுங்கள்</li>
            <li><strong>வடிவமைப்பை பாதுகாக்கவும்</strong>: Markdown வடிவமைப்பை அப்படியே வைக்கவும்</li>
          </ol>

          <h2>வளங்கள்</h2>
          <ul>
            <li>
              <a href="https://kubernetes.io/docs/contribute/localization/" target="_blank" rel="noopener noreferrer">
                Kubernetes Localization Guide
              </a>
            </li>
            <li>
              <a href="/glossary">தமிழ் சொற்களஞ்சியம்</a>
            </li>
            <li>
              <a href="https://kubernetes.io/hi/" target="_blank" rel="noopener noreferrer">
                Hindi Localization (reference)
              </a>
            </li>
            <li>
              <a href="https://slack.k8s.io" target="_blank" rel="noopener noreferrer">
                SIG Docs Slack
              </a>{' '}
              — #sig-docs-localizations channel
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
