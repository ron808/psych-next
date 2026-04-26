// All icons via react-icons Lucide set — consistent, scalable, zero emoji
export {
  LuBrain       as BrainIcon,
  LuHeart       as HeartIcon,
  LuUsers       as UsersIcon,
  LuRocket      as RocketIcon,
  LuBriefcase   as WorkIcon,
  LuPawPrint    as PawIcon,
  LuZap         as ZapIcon,
  LuSparkles    as SparkleIcon,
  LuWaves       as WavesIcon,
  LuClock       as ClockIcon,
  LuShare2      as ShareIcon,
  LuChevronLeft as ChevronLeft,
  LuCheck       as CheckIcon,
  LuX           as CloseIcon,
  LuStar        as StarIcon,
  LuFlame       as FlameIcon,
  LuLeaf        as LeafIcon,
  LuDrama       as DramaIcon,
  LuArrowRight  as ArrowRight,
  LuLayoutGrid  as GridIcon,
  LuUser        as UserIcon,
  LuChevronDown as ChevronDown,
  LuCrown       as CrownIcon,
  LuWand        as WandIcon,
} from 'react-icons/lu';

import type { ModuleKind } from './types';
import { LuBrain, LuHeart, LuUsers, LuRocket, LuCrown } from 'react-icons/lu';

export function ModuleIcon({ kind, size = 22 }: { kind: ModuleKind; size?: number }) {
  const props = { size };
  switch (kind) {
    case 'mbti':       return <LuBrain {...props} />;
    case 'love':       return <LuHeart {...props} />;
    case 'friendship': return <LuUsers {...props} />;
    case 'career':     return <LuRocket {...props} />;
    case 'disney':     return <LuCrown {...props} />;
  }
}
