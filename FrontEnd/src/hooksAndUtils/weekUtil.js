const weekNumberCache = {};

const normalizeDateKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getWeekNumber = (date) => {
    const cacheKey = normalizeDateKey(date);
    if (weekNumberCache[cacheKey]) return weekNumberCache[cacheKey];

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));

    const yearStartMillis = Date.UTC(d.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((d.getTime() - yearStartMillis) / 86400000 + 1) / 7);

    weekNumberCache[cacheKey] = weekNumber;
    return weekNumber;
};
  
  export const groupScreeningsByWeek = (screenings) => {
    const grouped = {};
    for (const screening of screenings) {
      const week = getWeekNumber(new Date(screening.startTime));
      if (!grouped[week]) {
        grouped[week] = [];
      }
      grouped[week].push(screening);
    }
    return Object.keys(grouped).map((week) => ({
      week,
      screenings: grouped[week],
    }));
  };