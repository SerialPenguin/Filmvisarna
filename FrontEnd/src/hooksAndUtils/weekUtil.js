export const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
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