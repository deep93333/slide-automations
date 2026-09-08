import { Divider, PageTitle } from "@/components/ui";
import { useAppState } from "@/store/hooks";
import { selectFilteredEvents } from "@/store/selectors";

import styles from "./activity.module.css";
import { ActivityFilters } from "./ActivityFilters";
import { ActivityRow } from "./ActivityRow";

const FADE_AFTER = 9;

export function ActivityView() {
  const state = useAppState();
  const events = selectFilteredEvents(state);

  return (
    <>
      <div className={styles.header}>
        <PageTitle>Activity</PageTitle>
        <span className={styles.spacer} />
        <ActivityFilters />
      </div>
      <Divider className={styles.divider} />
      <div className={styles.list}>
        {events.map((event, index) => (
          <div key={event.id}>
            {(index === 0 || events[index - 1].day !== event.day) && <div className={styles.day}>{event.day}</div>}
            <ActivityRow event={event} />
          </div>
        ))}
        {events.length === 0 && <p className={styles.empty}>Nothing here.</p>}
      </div>
      {events.length > FADE_AFTER && <div className={styles.fade} aria-hidden="true" />}
    </>
  );
}
