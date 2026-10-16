import {
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  Library,
  Wrench,
} from "lucide-react";
import "./learning-extras.css";

const resources = [
  {
    title: "LP Army Academy",
    text: "Start with LP 101 for newcomers.",
    href: "https://www.lparmy.com/academy",
    icon: BookOpen,
  },
  {
    title: "LP Army Playground",
    text: "Practice with pretend tokens.",
    href: "https://www.lparmy.com/playground",
    icon: FlaskConical,
  },
  {
    title: "Strategy Library",
    text: "Explore setups and their tradeoffs.",
    href: "https://www.lparmy.com/strategies",
    icon: Library,
  },
  {
    title: "Community Tools",
    text: "Find MetEngine, Decoder Farmer, and Rocket Scan.",
    href: "https://www.lparmy.com/community-tools",
    icon: Wrench,
  },
];
export default function EcosystemLinks() {
  return (
    <nav
      className="ecosystem-links"
      aria-label="Official LP Army learning resources"
    >
      <h4>Your next practice stops</h4>
      <p>Keep learning with the LP Army. These open their official site.</p>
      <div>
        {resources.map(({ title, text, href, icon: Icon }) => (
          <a key={href} href={href} target="_blank" rel="noreferrer">
            <Icon size={18} />
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <ArrowUpRight size={15} />
          </a>
        ))}
      </div>
    </nav>
  );
}
