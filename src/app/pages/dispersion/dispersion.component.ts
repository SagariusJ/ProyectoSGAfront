import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../pipes/filter.pipe'; 
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dispersion',
  standalone: true,
  imports: [CommonModule, FilterPipe, LimitPipe, PaginatePipe, FormsModule],
  templateUrl: './dispersion.component.html',
  styleUrl: './dispersion.component.css'
})
export class DispersionComponent implements OnInit{
  currentPage = 1;
  selectedLimit = 5;
  filterPost = "";

  posts: any

  ngOnInit(): void {
    
  }

}
