import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, UserInfo, Comment } from './interfaces';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(private http: HttpClient) {}

    readonly ROOT_URL = 'https://jsonplaceholder.typicode.com'

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.ROOT_URL}/posts/`)
    }

    getUserInfo(userId: number): Observable<UserInfo> {
        return this.http.get<UserInfo>(`${this.ROOT_URL}/users/${userId}`)
    }

    getComments(postId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.ROOT_URL}/comments?postId=${postId}`)
    }
}