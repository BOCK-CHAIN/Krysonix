import { LinkedHashSet } from "./LinkedHashSet";

export function fifo(refArr: number[], frames: number) {
  const set = new LinkedHashSet();
  let hits = 0;
  let faults = 0;
  let snapshot = [];

  for (let i = 0; i < refArr.length; i++) {
    let faultIdx = -1;
    let hitIdx = -1;
    let replacedNumber = null;

    if (set.contains(refArr[i])) {
      hits++;
      hitIdx = set.elements().findIndex((el) => el === refArr[i]);
    } else {
      if (set.size() === frames) {
        replacedNumber = set.elements()[0];
        set.deleteFirst();
      }
      set.add(refArr[i]);
      faults++;
      faultIdx = set.elements().findIndex((el) => el === refArr[i]);
    }

    const fra = set.elements();
    while (fra.length < frames) {
      fra.push("-");
    }

    snapshot.push({
      step: i + 1,
      page: refArr[i],
      hits,
      faults,
      faultIdx,
      hitIdx,
      frames: fra,
      replacedNumber,
    });
  }

  return snapshot;
}

