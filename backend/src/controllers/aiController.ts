import { Request, Response } from 'express';
import { Vehicle, IVehicle } from '../models/Vehicle';

export const handleAiChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'A valid message is required' });
      return;
    }

    const lowerMsg = message.toLowerCase();
    let suggestedVehicles: any[] = [];
    let responseText = '';
    let intent = 'general_inquiry';

    // 1. Check for dream car / speed / performance / electric inquiry
    if (
      lowerMsg.includes('fast') ||
      lowerMsg.includes('sports') ||
      lowerMsg.includes('electric') ||
      lowerMsg.includes('acceleration') ||
      lowerMsg.includes('supercar') ||
      lowerMsg.includes('horsepower')
    ) {
      intent = 'performance_recommendation';
      suggestedVehicles = await Vehicle.find({
        $or: [
          { category: { $regex: /sports|electric/i } },
          { 'specs.horsepower': { $gte: 500 } },
          { fuelType: 'Electric' }
        ]
      }).limit(3);

      if (suggestedVehicles.length === 0) {
        suggestedVehicles = await Vehicle.find().limit(2);
      }

      const vehicleNames = suggestedVehicles.map((v) => `${v.make} ${v.model}`).join(', ');
      responseText = `Based on your desire for peak performance and speed, I strongly recommend checking out our top-tier machines: ${vehicleNames}. Featuring instant torque, sub-3-second acceleration, and track-engineered chassis, they represent the absolute pinnacle of automotive exhilaration.`;
    }
    // 2. Check for SUV / family / spacious / road trip inquiry
    else if (
      lowerMsg.includes('suv') ||
      lowerMsg.includes('family') ||
      lowerMsg.includes('spacious') ||
      lowerMsg.includes('travel') ||
      lowerMsg.includes('luggage') ||
      lowerMsg.includes('camping')
    ) {
      intent = 'family_utility_recommendation';
      suggestedVehicles = await Vehicle.find({
        category: { $regex: /SUV|Cross/i }
      }).limit(3);

      if (suggestedVehicles.length === 0) {
        suggestedVehicles = await Vehicle.find().limit(2);
      }

      const vehicleNames = suggestedVehicles.map((v) => `${v.make} ${v.model}`).join(', ');
      responseText = `For unmatched comfort, generous cargo capacity, and effortless long-distance touring with family, the ${vehicleNames} would be the ideal choice from our collection. Built with whisper-quiet cabins, advanced driver assist suites, and elevated driving positions.`;
    }
    // 3. Check for financing / purchase / warranty
    else if (lowerMsg.includes('finance') || lowerMsg.includes('loan') || lowerMsg.includes('rate') || lowerMsg.includes('lease')) {
      intent = 'financing_info';
      responseText = `We offer competitive APR financing starting at 2.9% for qualified buyers, alongside flexible 24- to 48-month luxury leases with zero upfront capital options. Our finance specialists can tailor a bespoke acquisition package in under 15 minutes.`;
    }
    // 4. Check for test drive
    else if (lowerMsg.includes('test drive') || lowerMsg.includes('appointment') || lowerMsg.includes('visit')) {
      intent = 'test_drive';
      responseText = `You can experience any vehicle in our showroom with a private 45-minute VIP test drive accompanied by a vehicle specialist. Select any vehicle in our catalog and click "Schedule VIP Drive" or speak directly with our concierge.`;
    }
    // 5. Default concierge response
    else {
      intent = 'general_assistance';
      suggestedVehicles = await Vehicle.find().sort({ price: -1 }).limit(2);
      responseText = `Welcome to our Luxury Dealership Concierge. Whether you're searching for your dream performance machine, an ultra-refined luxury cruiser, or custom bespoke configuration, I am here to curate the perfect match for you. Tell me what features or driving experience you desire!`;
    }

    res.status(200).json({
      response: responseText,
      suggestedVehicles,
      intent
    });
  } catch (error: any) {
    res.status(500).json({ error: 'AI Concierge error: ' + error.message });
  }
};
