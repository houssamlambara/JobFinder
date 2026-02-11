
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-job-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './job-details.html'
})
export class JobDetailsComponent {
    // Mock data for now
    job = {
        title: 'Senior Product Designer',
        company: 'TechFlow',
        location: 'New York, NY',
        salary: '$140k - $180k',
        type: 'Full-time',
        posted: '2h ago',
        description: `We are looking for a Senior Product Designer to join our team and help us build the future of our product. You will work closely with product managers, engineers, and other designers to create intuitive and beautiful experiences for our users.`,
        requirements: [
            '5+ years of experience in product design',
            'Strong portfolio showcasing your design process and visual skills',
            'Proficiency in Figma, Sketch, or Adobe XD',
            'Experience with design systems and component libraries',
            'Excellent communication and collaboration skills'
        ],
        benefits: [
            'Competitive salary and equity',
            'Health, dental, and vision insurance',
            'Unlimited PTO',
            'Remote-friendly culture'
        ]
    };
}
