'use client';

import { Textarea, Input, Label } from "@/components/ui";
import { PatientFormData } from './PatientCreateModal';


interface LifeStoryStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function LifeStoryStep({ formData, setFormData }: LifeStoryStepProps) {
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
        <h3 className="text-lg font-semibold text-cf-ink">Life Story</h3>
        <p className="text-sm text-cf-ink-60">Who the patient is as a person</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalHistory" className="text-sm font-medium">
          Personal History
        </Label>
        <Textarea
          id="personalHistory"
          name="personalHistory"
          placeholder="I was a primary school teacher for 35 years. I was born in Hong Kong and came to the UK in 1968..."
          value={formData.personalHistory || ''}
          onChange={handleInputChange}
          className="border-cf-border min-h-[100px]"
        />
        <p className="text-xs text-cf-ink-40">Who they were before retirement, their career, their background</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="familyBackground" className="text-sm font-medium">
          Family Background
        </Label>
        <Textarea
          id="familyBackground"
          name="familyBackground"
          placeholder="Married to Peter (deceased 2019), two children, three grandchildren..."
          value={formData.familyBackground || ''}
          onChange={handleInputChange}
          className="border-cf-border min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatMakesMeSmile" className="text-sm font-medium">
          What Makes Me Smile
        </Label>
        <Input
          id="whatMakesMeSmile"
          name="whatMakesMeSmile"
          placeholder="My granddaughter's drawings, a good cup of tea, watching garden birds"
          value={formData.whatMakesMeSmile || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatUpsetsMe" className="text-sm font-medium">
          What Upsets Me
        </Label>
        <Input
          id="whatUpsetsMe"
          name="whatUpsetsMe"
          placeholder="Feeling rushed, people talking over me, not being able to garden"
          value={formData.whatUpsetsMe || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatMattersToMe" className="text-sm font-medium">
          What Matters to Me
        </Label>
        <Input
          id="whatMattersToMe"
          name="whatMattersToMe"
          placeholder="Dignity, independence, staying in my own home, seeing my family"
          value={formData.whatMattersToMe || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lifeHistory" className="text-sm font-medium">
          Life History (Full Story)
        </Label>
        <Textarea
          id="lifeHistory"
          name="lifeHistory"
          placeholder="Write a fuller story of the patient's life..."
          value={formData.lifeHistory || ''}
          onChange={handleInputChange}
          className="border-cf-border min-h-[120px]"
        />
        <p className="text-xs text-cf-ink-40">This will help carers understand the patient as a whole person</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="importantPeople" className="text-sm font-medium">
          Important People in My Life
        </Label>
        <Input
          id="importantPeople"
          name="importantPeople"
          placeholder="My daughter Margaret, my son James, my granddaughter Sophia, my friend Mrs. Patel"
          value={formData.importantPeople || ''}
          onChange={handleInputChange}
          className="border-cf-border"
        />
      </div>
    </div>
  );
}