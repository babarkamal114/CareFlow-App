'use client';

import { Input, Label, Textarea } from "@/components/ui";
import { PatientFormData } from './PatientCreateModal';


interface PreferencesStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function PreferencesStep({ formData, setFormData }: PreferencesStepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-cf-ink">Preferences & Wishes</h3>
        <p className="text-sm text-cf-ink-60">Daily routine, likes, dislikes, and what matters to the patient</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wakeTime" className="text-sm font-medium">
            Wake Time
          </Label>
          <Input
            id="wakeTime"
            name="wakeTime"
            type="time"
            value={formData.wakeTime || ''}
            onChange={handleInputChange}
            className="border-cf-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedTime" className="text-sm font-medium">
            Bed Time
          </Label>
          <Input
            id="bedTime"
            name="bedTime"
            type="time"
            value={formData.bedTime || ''}
            onChange={handleInputChange}
            className="border-cf-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="breakfastTime" className="text-sm font-medium">
            Breakfast Time
          </Label>
          <Input
            id="breakfastTime"
            name="breakfastTime"
            type="time"
            value={formData.breakfastTime || ''}
            onChange={handleInputChange}
            className="border-cf-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lunchTime" className="text-sm font-medium">
            Lunch Time
          </Label>
          <Input
            id="lunchTime"
            name="lunchTime"
            type="time"
            value={formData.lunchTime || ''}
            onChange={handleInputChange}
            className="border-cf-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dinnerTime" className="text-sm font-medium">
            Dinner Time
          </Label>
          <Input
            id="dinnerTime"
            name="dinnerTime"
            type="time"
            value={formData.dinnerTime || ''}
            onChange={handleInputChange}
            className="border-cf-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathPreference" className="text-sm font-medium">
            Bath Preference
          </Label>
          <Input
            id="bathPreference"
            name="bathPreference"
            placeholder="Evening bath, prefers shower"
            value={formData.bathPreference || ''}
            onChange={handleInputChange}
            className="border-cf-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teaPreference" className="text-sm font-medium">
          Tea Preference
        </Label>
        <Input
          id="teaPreference"
          name="teaPreference"
          placeholder="Builder's tea, one sugar, splash of milk"
          value={formData.teaPreference || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietaryPreferences" className="text-sm font-medium">
          Dietary Preferences
        </Label>
        <Input
          id="dietaryPreferences"
          name="dietaryPreferences"
          placeholder="Vegetarian, likes fish, no spicy food"
          value={formData.dietaryPreferences || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="culturalReligious" className="text-sm font-medium">
          Cultural & Religious Needs
        </Label>
        <Input
          id="culturalReligious"
          name="culturalReligious"
          placeholder="Buddhist, no meat on full moon, needs meditation time"
          value={formData.culturalReligious || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Likes</Label>
        <Input
          name="likes"
          placeholder="Knitting, Radio 4, her granddaughter, watching birds"
          value={formData.likes || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Dislikes</Label>
        <Input
          name="dislikes"
          placeholder="Being rushed, people talking over her, fish"
          value={formData.dislikes || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Hobbies & Interests</Label>
        <Input
          name="hobbies"
          placeholder="Gardening, reading, knitting, listening to music"
          value={formData.hobbies || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dailyRoutine" className="text-sm font-medium">
          Daily Routine Notes
        </Label>
        <Textarea
          id="dailyRoutine"
          name="dailyRoutine"
          placeholder="Likes to start the day with a cup of tea, prefers to dress before breakfast..."
          value={formData.dailyRoutine || ''}
          onChange={handleInputChange}
          className="border-cf-border min-h-[80px]"
        />
      </div>
    </div>
  );
}