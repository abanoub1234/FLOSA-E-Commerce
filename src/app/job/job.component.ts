import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // ✅ Import this
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgbModule, FormsModule],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements OnInit {
  jobs: any[] = [];
  selectedJob: any = null;
  applicant = { name: '', email: '' };
  message = '';
  messageType = ''; // 'success' or 'error'

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.fetchJobs();
  }

  fetchJobs(): void {
    this.http.get<any[]>('http://localhost:3000/api/jobs/').subscribe(
      (data) => (this.jobs = data),
      (error) => console.error('Error fetching jobs:', error)
    );
  }

  openApplyModal(job: any, content: any): void {
    this.selectedJob = job;
    this.message = '';
    this.applicant = { name: '', email: '' };
    this.modalService.open(content, { centered: true });
  }

  applyForJob(modal: any): void {
    if (!this.applicant.name.trim() || !this.applicant.email.trim()) {
      this.message = 'Please fill in all fields.';
      this.messageType = 'error';
      return;
    }

    // ✅ Retrieve token from localStorage
    const token = localStorage.getItem('token');

    // ✅ Set headers with token (if available)
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '', // ✅ Add token if exists
      'Content-Type': 'application/json',
    });

    this.http
      .post(
        `http://localhost:3000/api/jobs/apply/${this.selectedJob._id}`,
        this.applicant,
        { headers } // ✅ Include headers with token
      )
      .subscribe(
        (response: any) => {
          this.message = response.message;
          this.messageType = 'success';

          setTimeout(() => {
            modal.close();
          }, 2000);
        },
        (error) => {
          this.message = error.error.message || 'An error occurred.';
          this.messageType = 'error';
        }
      );
  }
}
