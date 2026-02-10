import { general } from './general';
import { navbar } from './navbar';
import { dashboard } from './page/dashboard';
import { map } from './page/map';
import { tag } from './page/tag';
import { branch } from './page/branch';
import { calendar } from './page/calendar';
import { profile } from './page/profilePage';
import { setting } from './page/setting';
import { toast } from './toast';
import { validation } from './validation';

import { maintenance } from './page/maintenance';
import { organization } from './page/organization';
import { ota } from './page/ota';
import { products } from './page/products';
import { role } from './page/role';
import { user } from './page/user';
import { auth } from './page/auth';
import { journals } from './page/journals';

export const en = {
  navbar,
  setting,
  general,
  profile,
  validation,
  toast,
  dashboard,
  map,
  tag,
  branch,
  calendar,
  maintenance,
  organization,
  ota,
  products,
  role,
  user,
  auth,
  journals
} as const;
