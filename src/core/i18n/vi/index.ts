import { general } from './general';
import { navbar } from './navbar';
import { dashboard } from './page/dashboard';
import { map } from './page/map';
import { profile } from './page/profilePage';
import { setting } from './page/setting';
import { toast } from './toast';
import { validation } from './validation';

export const vi = {
  navbar,
  setting,
  general,
  profile,
  validation,
  toast,
  dashboard,
  map
} as const;
