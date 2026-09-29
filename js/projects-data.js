/**
 * 프로젝트를 추가하려면 아래 배열에 객체를 계속 넣으면 됩니다.
 * tagline, description은 { en, ko }로 적습니다.
 * image: 이미지 URL 또는 프로젝트 폴더 내 상대 경로 (예: "images/project1.png")
 */
const PROJECTS = [
  {
    title: "BridgeWare",
    tagline: {
      en: "PIMS: Self-Owned Cloud Infrastructure Managed Service.",
      ko: "PIMS: 직접 소유하는 클라우드 인프라 관리 서비스",
    },
    description: {
      en: "A managed infrastructure service that empowers users to deploy and control their own secure cloud servers seamlessly without technical complexity.",
      ko: "기술적인 복잡함 없이, 안전한 클라우드 서버를 직접 배포하고 관리할 수 있게 돕는 인프라 관리 서비스입니다.",
    },
    image: "/images/projects/bridgware.png",
    preview: "wall",
    url: "/coming-soon",
  },
  {
    title: "Product & Solution",
    tagline: {
      en: "SaaS Product Engineering: Delivering High-Performance Managed Infrastructure",
      ko: "SaaS 제품 엔지니어링: 고성능 관리형 인프라",
    },
    description: {
      en: [
        "Innovative SaaS Solutions: From Automated Code Audits to Managed WebOps",
        "Empowering Business through Managed SaaS & Infrastructure-as-a-Service (IaaS)",
      ],
      ko: [
        "혁신적인 SaaS 솔루션: 자동 코드 감사부터 관리형 WebOps까지",
        "관리형 SaaS와 IaaS로 비즈니스 성장을 지원합니다",
      ],
    },
    image: "/images/projects/project-2.png",
    preview: "lab",
    url: "/coming-soon",
  },
  {
    title: "Full-stack & WebOps",
    tagline: {
      en: "Full-stack SaaS Engineering & WebOps: Scalable Solutions for Modern Infrastructure",
      ko: "풀스택 SaaS 엔지니어링과 WebOps: 현대 인프라를 위한 확장 가능한 솔루션",
    },
    description: {
      en: [
        "Building Resilient SaaS Architectures through Expert WebOps and Full-stack Development",
        "Next-Gen WebOps & SaaS Development: Architecting Automated Business Solutions",
      ],
      ko: [
        "전문 WebOps와 풀스택 개발로 견고한 SaaS 아키텍처를 만듭니다",
        "차세대 WebOps와 SaaS 개발: 자동화된 비즈니스 솔루션을 설계합니다",
      ],
    },
    image: "/images/projects/project-3.png",
    preview: "monitor",
    url: "/coming-soon",
  },
];
