export class CourseModelClass {
  private id: number;
  private name: string;

  public getId(): number {
    return this.id;
  }

  public setId(id: number): this {
    this.id = id;
    return this;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): this {
    this.name = name;
    return this;
  }
}
