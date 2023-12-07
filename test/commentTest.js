import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';
import { nullID } from '../lib/element';

describe('CommentTests', () => {
    it('parseCommentTest', async () => {
        const manager = new UmlManager();
        const data = {
            comment: {
                id: 'T1J0hAryQORw9sMaNfgUwVDor7CD',
                annotatedElements: ['T1J0hAryQORw9sMaNfgUwVDor7eE'],
                body: "it's freestyle not freedom"
            },
            owner: 'l3mdRJ0ChhLsbOXcs1XT3M5IwCOD'
        }
        const ownerData = {
            class: {
                id: 'l3mdRJ0ChhLsbOXcs1XT3M5IwCOD',
                ownedComments: ['T1J0hAryQORw9sMaNfgUwVDor7CD']
            }
        }
        const annotatedData = {
            class: {
                id: 'T1J0hAryQORw9sMaNfgUwVDor7eE',
            }
        }
        const comment = parse(data);
        const clazz = parse(ownerData);
        const clazzToo = parse(annotatedData);
        manager.add(comment);
        manager.add(clazz);
        manager.add(clazzToo);
        assert.equal(comment.owner.id(), 'l3mdRJ0ChhLsbOXcs1XT3M5IwCOD');
        assert.equal(await comment.annotatedElements.front(), clazzToo);
        assert.equal(comment.body, "it's freestyle not freedom");
        assert.equal(await clazz.ownedComments.front(), comment);
    });
    it('emitCommentTest', () => {
        const manager = new UmlManager();
        const comment = manager.create('comment');
        const clazz = manager.create('class');
        const clazzToo = manager.create('class');
        clazz.ownedComments.add(comment);
        comment.annotatedElements.add(clazzToo);
        comment.body = "it's freestyle not freedom";
        const commentEmit = comment.emit();
        assert.equal(JSON.stringify(commentEmit), JSON.stringify({
            comment: {
                id: comment.id,
                annotatedElements: [
                    clazzToo.id
                ],
                body: "it's freestyle not freedom"
            },
            owner: clazz.id
        }));        
    });
    it('deleteCommentTest', async () => {
        const manager = new UmlManager();
        const comment = manager.create('comment');
        const clazz = manager.create('class');
        clazz.ownedComments.add(comment);
        assert.equal(comment.owner.id(), clazz.id);
        assert.equal(clazz.ownedComments.size(), 1);
        await manager.deleteElement(comment);
        assert.equal(comment.owner.id(), nullID());
        assert.equal(clazz.ownedComments.size(), 0);
    });
})