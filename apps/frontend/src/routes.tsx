import { Routes, Route } from "react-router";
import { NotesPage } from "./components/pages/NotesPage";
import { NoteEditorPage } from "./components/pages/NoteEditorPage";
import { ClearDayLayout } from "./components/pages/clearday/ClearDayLayout";
import { CalendarPage } from "./components/pages/clearday/CalendarPage";
import { CheckInPage } from "./components/pages/clearday/CheckInPage";
import { SetupPage } from "./components/pages/clearday/SetupPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* ClearDay — matched before the generic /:id catch-all */}
            <Route path="/clearday" element={<ClearDayLayout />}>
                <Route index element={<CalendarPage />} />
                <Route path="checkin" element={<CheckInPage />} />
                <Route path="setup" element={<SetupPage />} />
            </Route>

            {/* Original notes app */}
            <Route index element={<NotesPage />} />
            <Route path="/:id" element={<NoteEditorPage />} />
        </Routes>
    );
}
