import { Controller } from "@decorators/controller";
import { ContentController } from "../content/controller";
import { Page } from "./entity";
import { PageService } from "./service";
import { Container } from "@decorators/di-container";

/**
 * REST API controller for the {@link Page} entity, mounted at `/api/page`.
 *
 * Inherits standard CRUD route handling from {@link ContentController} and
 * wires up the {@link PageService} as the underlying data service via DI.
 */
@Controller("/api/page")
export class PageController extends ContentController<Page>
{
    /**
     * The service instance used for all data operations on {@link Page} entities.
     * Resolved automatically from the DI container.
     */
    protected service: PageService = Container.resolve(PageService);

    /**
     * Returns the {@link Page} entity constructor, used by the base controller
     * to introspect field metadata via `@Entity` decorators.
     *
     * @returns The {@link Page} class reference.
     */
    public getTargetEntity(): Function {
        return Page;
    }
}