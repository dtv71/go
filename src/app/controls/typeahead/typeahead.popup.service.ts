﻿import {
    Injectable, Injector, Type,
    TemplateRef, ViewRef, ViewContainerRef,
    ComponentRef, ApplicationRef, Renderer2,
    ComponentFactoryResolver,
} from '@angular/core';

export class ContentRef {
    constructor(public nodes: any[], public viewRef?: ViewRef,
        public componentRef?: ComponentRef<any>) { }
}

@Injectable()
export class PopupService<T> {
    constructor(private injector: Injector, private renderer: Renderer2,
        private componentFactoryResolver: ComponentFactoryResolver,
        private applicationRef: ApplicationRef) { }

    windowRef: ComponentRef<T> | null = null;
    private contentRef: ContentRef | null = null;

    isOpen() { return this.windowRef != null }
    setParams(params: { [key: string]: any } | any) {
        if (this.windowRef) {
            for (var key in params)
                (this.windowRef.instance as any)[key] = params[key]
        }
    }

    open(component: Type<T>, viewContainerRef: ViewContainerRef,
        content?: string | TemplateRef<any>, context?: any,
        params?: { [key: string]: any }
    ): ComponentRef<T> {
        if (!this.windowRef) {
            this.contentRef = this.getContentRef(content, context);
            this.windowRef = viewContainerRef.createComponent(
                this.componentFactoryResolver.resolveComponentFactory<T>(component),
                viewContainerRef.length,
                this.injector,
                this.contentRef.nodes);
            this.setParams(params);
        }
        return this.windowRef
    }

    close(viewContainerRef: ViewContainerRef) {
        if (this.windowRef) {
            viewContainerRef.remove(viewContainerRef.indexOf(this.windowRef.hostView));
            // this.windowRef.destroy();
            this.windowRef = null;

            if (this.contentRef && this.contentRef.viewRef) {
                this.applicationRef.detachView(this.contentRef.viewRef);
                this.contentRef.viewRef.destroy();
                this.contentRef = null;
            }
        }
    }

    /** create ng-template */
    private getContentRef(content?: string | TemplateRef<any>, context?: any): ContentRef {
        if (!content) {
            return new ContentRef([]);
        } else if (content instanceof TemplateRef) {
            const viewRef = content.createEmbeddedView(context);
            this.applicationRef.attachView(viewRef);
            return new ContentRef([viewRef.rootNodes], viewRef);
        } else {
            return new ContentRef([[this.renderer.createText(`${content}`)]]);
        }
    }
}  