import React, { useState, useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllEvents, getAllEventTypes } from "../services/complianceService";
import EventForm from "./EventForm";
import { getAlertColor } from "../utils/reminderUtils";

// Setup the localizer for react-big-calendar
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, typesData] = await Promise.all([
        getAllEvents(),
        getAllEventTypes(),
      ]);
      setEvents(eventsData);
      setEventTypes(typesData);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform events for react-big-calendar
  const calendarEvents = useMemo(() => {
    return events.map((event) => {
      const eventType = eventTypes.find((t) => t.id === event.eventTypeId);
      return {
        id: event.id,
        title: event.title,
        start: new Date(event.dueDate),
        end: new Date(event.dueDate),
        resource: event,
        color: eventType?.color || "#3B82F6",
      };
    });
  }, [events, eventTypes]);

  // Custom event style getter
  const eventStyleGetter = (event) => {
    const alertColor = getAlertColor(event.resource.dueDate);
    let backgroundColor = event.color;

    // Override color based on alert level
    if (alertColor === "red") {
      backgroundColor = "#EF4444";
    } else if (alertColor === "yellow") {
      backgroundColor = "#F59E0B";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: event.resource.status === "completed" ? 0.6 : 1,
        color: "white",
        border: "none",
        display: "block",
        fontSize: "12px",
        padding: "2px 5px",
      },
    };
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowForm(true);
  };

  // Handle slot selection (create new event)
  const handleSelectSlot = (slotInfo) => {
    setSelectedEvent({
      dueDate: format(slotInfo.start, "yyyy-MM-dd"),
    });
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedEvent(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-600">On Track (&gt;7 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Due Soon (3-7 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm text-gray-600">
              Critical (&lt;3 days / Overdue)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-400"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </div>
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div style={{ height: "700px" }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            popup
            tooltipAccessor={(event) => {
              const status = event.resource.status;
              const assignedTo = event.resource.assignedTo || "Unassigned";
              return `${event.title}\nStatus: ${status}\nAssigned: ${assignedTo}`;
            }}
          />
        </div>
      </div>
      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={selectedEvent}
          eventTypes={eventTypes}
          onClose={handleFormClose}
        />
      )}
      {/* Instructions
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Calendar Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on any event to view or edit details</li>
          <li>• Click on an empty date to create a new event</li>
          <li>
            • Use the view buttons to switch between Month, Week, Day, and
            Agenda views
          </li>
          <li>• Events are color-coded based on urgency and type</li>
        </ul>
      </div> */}
    </div>
  );
};

export default EventCalendar;
