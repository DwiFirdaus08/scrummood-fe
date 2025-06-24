"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";

type JournalEntry = {
  id: number;
  date: Date;
  title: string;
  preview: string;
  emotions: {
    happy: number;
    neutral: number;
    stressed: number;
    sad: number;
    angry: number;
  };
};

const journalEntries: JournalEntry[] = [
  {
    id: 1,
    date: new Date(2023, 3, 28),
    title: "Daily Scrum Tim Frontend",
    preview:
      "Meeting hari ini berjalan baik. Saya merasa tim sangat kolaboratif dan saling mendukung...",
    emotions: {
      happy: 70,
      neutral: 20,
      stressed: 5,
      sad: 3,
      angry: 2,
    },
  },
  {
    id: 2,
    date: new Date(2023, 3, 27),
    title: "Daily Scrum Tim Backend",
    preview:
      "Saya agak stres di meeting hari ini karena deadline yang mendekat. Tim tampak...",
    emotions: {
      happy: 40,
      neutral: 30,
      stressed: 20,
      sad: 5,
      angry: 5,
    },
  },
  {
    id: 3,
    date: new Date(2023, 3, 26),
    title: "Koordinasi Antar Tim",
    preview:
      "Meeting koordinasi cukup produktif tapi saya melihat ada sedikit ketegangan antar tim...",
    emotions: {
      happy: 50,
      neutral: 20,
      stressed: 15,
      sad: 10,
      angry: 5,
    },
  },
];

export function JournalEntries() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    if (expandedEntry === id) {
      setExpandedEntry(null);
    } else {
      setExpandedEntry(id);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{entry.title}</h3>
                    <p className="text-sm text-gray-500">
                      {entry.date.toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(entry.id)}
                    aria-label={
                      expandedEntry === entry.id
                        ? "Collapse entry"
                        : "Expand entry"
                    }
                  >
                    {expandedEntry === entry.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <p className="text-sm">
                  {expandedEntry === entry.id ? (
                    <>
                      {entry.preview}
                      <br />
                      <br />
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </>
                  ) : (
                    entry.preview
                  )}
                </p>

                {expandedEntry === entry.id && (
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="mr-1 h-4 w-4" />
                      Ubah
                    </Button>
                    <Button size="sm" variant="outline">
                      <BookOpen className="mr-1 h-4 w-4" />
                      Lihat Analisis
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex border-t">
                <div
                  className="h-2 bg-green-500"
                  style={{ width: `${entry.emotions.happy}%` }}
                ></div>
                <div
                  className="h-2 bg-blue-500"
                  style={{ width: `${entry.emotions.neutral}%` }}
                ></div>
                <div
                  className="h-2 bg-yellow-500"
                  style={{ width: `${entry.emotions.stressed}%` }}
                ></div>
                <div
                  className="h-2 bg-gray-500"
                  style={{ width: `${entry.emotions.sad}%` }}
                ></div>
                <div
                  className="h-2 bg-red-500"
                  style={{ width: `${entry.emotions.angry}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <h3 className="font-medium">Pilih Tanggal</h3>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
