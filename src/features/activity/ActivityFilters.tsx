import { useCallback } from "react";

import { Menu, MenuItem, MenuRoot, MenuTrigger, ProfileLockup } from "@/components/ui";
import { avatarUrl } from "@/data/avatars";
import { ALL_EVENT_GROUPS, EVENT_GROUP_LABELS } from "@/domain/format";
import { useAppDispatch, useAppState } from "@/store/hooks";
import type { ActivityMenu } from "@/store/reducer";
import { selectActivityAccountLabel, selectActivityTypeLabel } from "@/store/selectors";

/*
 * Two multi-selects with no "All" row: an empty selection already means
 * everything, so every option reads as checked and you uncheck to narrow.
 * They stay open on pick — the point of a multi-select is stacking choices
 * without reopening it each time.
 */
export function ActivityFilters() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { activityMenu, activityFilter, accounts } = state;

  const close = useCallback(() => dispatch({ type: "activity/setMenu", menu: null }), [dispatch]);
  const toggleMenu = (menu: ActivityMenu) =>
    dispatch({ type: "activity/setMenu", menu: activityMenu === menu ? null : menu });

  const everyGroup = activityFilter.groups.length === 0;
  const everyAccount = activityFilter.accounts.length === 0;

  return (
    <>
      <MenuRoot open={activityMenu === "type"} onClose={close}>
        <MenuTrigger
          variant="text"
          label={selectActivityTypeLabel(state)}
          open={activityMenu === "type"}
          onClick={() => toggleMenu("type")}
        />
        <Menu open={activityMenu === "type"} align="end" offset={10} minWidth={168} label="Filter by type">
          {ALL_EVENT_GROUPS.map((group) => (
            <MenuItem
              key={group}
              role="menuitemcheckbox"
              checked={everyGroup || activityFilter.groups.includes(group)}
              onSelect={() => dispatch({ type: "activity/toggleGroup", group })}
            >
              {EVENT_GROUP_LABELS[group]}
            </MenuItem>
          ))}
        </Menu>
      </MenuRoot>

      <MenuRoot open={activityMenu === "accounts"} onClose={close}>
        <MenuTrigger
          variant="text"
          label={selectActivityAccountLabel(state)}
          open={activityMenu === "accounts"}
          onClick={() => toggleMenu("accounts")}
        />
        <Menu open={activityMenu === "accounts"} align="end" offset={10} minWidth={232} label="Filter by account">
          {accounts.map((account) => (
            <MenuItem
              key={account.handle}
              role="menuitemcheckbox"
              checked={everyAccount || activityFilter.accounts.includes(account.handle)}
              onSelect={() => dispatch({ type: "activity/toggleAccount", handle: account.handle })}
            >
              <ProfileLockup
                name={account.name}
                handle={account.handle}
                avatarSrc={avatarUrl(account.handle)}
                verified
              />
            </MenuItem>
          ))}
        </Menu>
      </MenuRoot>
    </>
  );
}
