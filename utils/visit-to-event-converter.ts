import { Visit } from "types";

export function convertVisitToEvent(visits: Visit[]){
    return visits.map((visit) => {
  
    const [year, month, day] = visit.date.split('-').map(Number);
    const [startHour, startMin] = visit.startTime.split(':').map(Number);
    const [endHour, endMin] = visit.endTime.split(':').map(Number);

    const start = new Date(year, month - 1, day, startHour, startMin);
    const end = new Date(year, month - 1, day, endHour, endMin);

    return {
      id: visit.id,
      title: `${visit.patientName} - ${visit.carerName}`,
      start,
      end,
      resource: visit,
    };
  });
}