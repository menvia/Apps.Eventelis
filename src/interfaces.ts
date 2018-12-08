export interface ISchedule {
    _id: string;
    start: Date;
    end: Date;
    track: string;
    order: number;
    location: string;
}

export interface ISession {
    _id: string;
    app: string;
    ext_id: string;
    desc: string;
    event: string;
    removed: boolean;
    schedules: Array<ISchedule>;
    speakers: Array<string>;
    title: string;
    id: string;
}
