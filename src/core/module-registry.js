/**
 * BuildWise module registry.
 * One contract for every product feature: visibility, enablement and manager controls.
 */
export const MODULE_REGISTRY = Object.freeze([
  { id:'requests', title:'درخواست‌ها', section:'CRM', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'tasks', title:'پیگیری‌ها', section:'CRM', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'promotions', title:'پروموشن', section:'CRM', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'dashboard', title:'داشبورد', section:'CRM', visible:true, enabled:true, hideable:false, editable:true, deletable:false },
  { id:'properties', title:'املاک', section:'CRM', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'leads', title:'خواهان‌ها', section:'CRM', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'deals', title:'معاملات', section:'Deal', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'search', title:'جستجوی هوشمند', section:'Intelligence', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'construction', title:'ساخت و پروژه', section:'Construction', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'market', title:'بازار و ارزش‌گذاری', section:'Market', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'matching', title:'تطبیق', section:'Deal', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'room', title:'ROOM', section:'Portal', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'automation', title:'اتوماسیون', section:'Workflow', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'customerflow', title:'مشتری → مشاور', section:'CRM', visible:true, enabled:true, hideable:true, editable:true, deletable:true },
  { id:'ai', title:'دستیار AI', section:'AI', visible:true, enabled:true, hideable:true, editable:true, deletable:true }
]);

export function canManageModule(role) {
  return ['owner','manager'].includes(String(role || '').toLowerCase());
}

export function applyModulePatch(module, patch = {}) {
  if (!module || typeof module !== 'object') throw new TypeError('module is required');
  const next = { ...module };
  if (module.editable && patch.title != null) next.title = String(patch.title).trim() || module.title;
  if (module.hideable && patch.visible != null) next.visible = Boolean(patch.visible);
  if (patch.enabled != null) next.enabled = Boolean(patch.enabled);
  if (patch.sort_order != null && Number.isInteger(Number(patch.sort_order))) next.sort_order = Number(patch.sort_order);
  return next;
}

export function managerModuleControls(module) {
  return {
    hide: Boolean(module?.hideable),
    edit: Boolean(module?.editable),
    delete: Boolean(module?.deletable),
    save: true
  };
}

export const moduleRegistry = { MODULE_REGISTRY, canManageModule, applyModulePatch, managerModuleControls };
if (typeof globalThis !== 'undefined') globalThis.BuildWiseModuleRegistry = moduleRegistry;
